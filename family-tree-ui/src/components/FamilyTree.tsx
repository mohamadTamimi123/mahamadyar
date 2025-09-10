'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '@/lib/api';
import * as d3 from 'd3';

interface FamilyMember {
  id: number;
  name: string;
  father_name: string | null;
  father_id: number | null;
  children: FamilyMember[];
  created_at: string;
  data?: FamilyMember;
}

interface TreeNode {
  id: number;
  name: string;
  father_name: string | null;
  father_id: number | null;
  children: TreeNode[];
  data?: FamilyMember;
}

const FamilyTree: React.FC = () => {
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/family-members/tree/all');
      setFamilyData(response.data);
    } catch (err: unknown) {
      setError('خطا در بارگذاری داده‌ها');
      console.error('Error fetching family data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTreeVisualization = useCallback(() => {
    if (!svgRef.current || familyData.length === 0) return;

    // Clear previous visualization
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = 1200;
    const height = 800;
    
    svg.attr("width", width).attr("height", height);

    // Filter data based on search term
    const filteredData = familyData.filter(member =>
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (member.father_name && member.father_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (filteredData.length === 0) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "#666")
        .text(searchTerm ? "نتیجه‌ای یافت نشد" : "داده‌ای موجود نیست");
      return;
    }

    // Build hierarchy from family data
    const buildHierarchy = (data: FamilyMember[]) => {
      const map = new Map<number, TreeNode>();
      const roots: TreeNode[] = [];

      // Create nodes
      data.forEach(member => {
        map.set(member.id, {
          id: member.id,
          name: member.name,
          father_name: member.father_name,
          father_id: member.father_id,
          children: [],
          data: member
        });
      });

      // Build relationships
      data.forEach(member => {
        const node = map.get(member.id);
        if (member.father_id && map.has(member.father_id)) {
          const parent = map.get(member.father_id);
          if (parent && node) {
            parent.children.push(node);
          }
        } else {
          if (node) {
            roots.push(node);
          }
        }
      });

      return roots;
    };

    const rootNodes = buildHierarchy(filteredData);
    
    if (rootNodes.length === 0) {
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", height / 2)
        .attr("text-anchor", "middle")
        .attr("font-size", "18px")
        .attr("fill", "#666")
        .text("ساختار درختی یافت نشد");
      return;
    }

    // Create a virtual root if multiple trees
    const virtualRoot: TreeNode = rootNodes.length > 1 ? {
      id: -1,
      name: "ریشه‌های خانوادگی",
      father_name: null,
      father_id: null,
      children: rootNodes,
      data: undefined
    } : rootNodes[0];

    // Create tree layout
    const tree = d3.tree<TreeNode>()
      .size([height - 100, width - 200])
      .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    // Convert data to hierarchy
    const root = d3.hierarchy(virtualRoot, d => d.children);
    const treeData = tree(root);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 3])
      .on("zoom", (event) => {
        container.attr("transform", event.transform);
      });

    svg.call(zoom);

    // Create main container
    const container = svg.append("g")
      .attr("transform", "translate(100, 50)");

    // Add links
    container.selectAll(".link")
      .data(treeData.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", d3.linkHorizontal<unknown, unknown>()
        .x((d: unknown) => (d as { y: number }).y)
        .y((d: unknown) => (d as { x: number }).x))
      .style("fill", "none")
      .style("stroke", "#999")
      .style("stroke-width", 2)
      .style("stroke-opacity", 0.6);

    // Add nodes
    const nodes = container.selectAll(".node")
      .data(treeData.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .style("cursor", "pointer");

    // Add circles for nodes
    nodes.append("circle")
      .attr("r", 8)
      .style("fill", d => d.children ? "#4CAF50" : "#2196F3")
      .style("stroke", "#fff")
      .style("stroke-width", 2);

    // Add text labels
    nodes.append("text")
      .attr("dy", "0.35em")
      .attr("x", d => d.children ? -15 : 15)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "12px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#333")
      .text(d => d.data?.name || 'نامشخص')
      .style("font-weight", "bold");

    // Add father name if available
    nodes.append("text")
      .attr("dy", "1.2em")
      .attr("x", d => d.children ? -15 : 15)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "10px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#666")
      .text(d => d.data?.father_name ? `پدر: ${d.data.father_name}` : "")
      .style("font-style", "italic");

    // Add ID labels
    nodes.append("text")
      .attr("dy", "2em")
      .attr("x", d => d.children ? -15 : 15)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .style("font-size", "8px")
      .style("font-family", "Arial, sans-serif")
      .style("fill", "#999")
      .text(d => d.data?.id ? `ID: ${d.data.id}` : "")
      .style("font-style", "italic");

    // Add click handlers
    nodes.on("click", (event, d) => {
      if (d.data) {
        setSelectedMember(d.data);
        
        // Highlight selected node
        nodes.select("circle").style("fill", node => 
          node === d ? "#FF5722" : (node.children ? "#4CAF50" : "#2196F3")
        );
      }
    });

    // Add hover effects
    nodes.on("mouseover", function(event, d) {
      if (d.data) {
        d3.select(this).select("circle")
          .style("r", 12)
          .style("fill", "#FF9800");
      }
    })
    .on("mouseout", function(event, d) {
      if (d.data) {
        d3.select(this).select("circle")
          .style("r", 8)
          .style("fill", d.children ? "#4CAF50" : "#2196F3");
      }
    });

    // Reset zoom to fit content
    const bounds = container.node()?.getBBox();
    if (bounds) {
      const fullWidth = width;
      const fullHeight = height;
      const widthScale = fullWidth / bounds.width;
      const heightScale = fullHeight / bounds.height;
      const scale = Math.min(widthScale, heightScale) * 0.8;
      const translate = [
        (fullWidth - bounds.width * scale) / 2 - bounds.x * scale,
        (fullHeight - bounds.height * scale) / 2 - bounds.y * scale
      ];
      
      svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale)
      );
    }
  }, [familyData, searchTerm]);

  useEffect(() => {
    fetchFamilyData();
  }, []);

  useEffect(() => {
    if (familyData.length > 0) {
      createTreeVisualization();
    }
  }, [familyData, searchTerm, createTreeVisualization]);

  const filteredData = familyData.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.father_name && member.father_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-600">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          در حال بارگذاری نمودار درختی...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-red-500">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-5 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-2">
          🌳 نمودار درختی خانوادگی
        </h1>
        <p className="text-lg opacity-90">
          نمایش تعاملی روابط خانوادگی و نسل‌ها
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-bold text-slate-800">
              🔍 جستجو در نام‌ها:
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="نام شخص یا پدر را وارد کنید..."
              className="w-full p-3 border border-gray-300 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              dir="rtl"
            />
          </div>
          
          <div className="flex items-end">
            <div className="bg-gray-50 p-3 rounded-lg w-full">
              <div className="text-sm text-gray-600 space-y-1">
                <div>📊 تعداد کل اعضا: <span className="font-bold text-blue-600">{familyData.length}</span></div>
                <div>🔍 نتایج جستجو: <span className="font-bold text-green-600">{filteredData.length}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tree Visualization */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
        <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
          <svg ref={svgRef} className="w-full h-full"></svg>
        </div>
      </div>

      {/* Selected Member Details */}
      {selectedMember && (
        <div className="bg-white p-6 rounded-lg shadow-lg mb-5">
          <h3 className="text-xl font-bold text-slate-800 mb-4">
            📋 جزئیات انتخاب شده
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div><strong>شناسه:</strong> {selectedMember.id}</div>
              <div><strong>نام:</strong> {selectedMember.name}</div>
              <div><strong>نام پدر:</strong> {selectedMember.father_name || 'نامشخص'}</div>
              <div><strong>شناسه پدر:</strong> {selectedMember.father_id || 'ندارد'}</div>
            </div>
            <div className="space-y-2">
              <div><strong>تاریخ ایجاد:</strong> {new Date(selectedMember.created_at).toLocaleDateString('fa-IR')}</div>
              <div><strong>تعداد فرزندان:</strong> {selectedMember.children?.length || 0}</div>
              <div><strong>وضعیت:</strong> 
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  selectedMember.children?.length > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedMember.children?.length > 0 ? 'دارای فرزند' : 'بدون فرزند'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 p-6 rounded-lg text-center">
        <h4 className="text-lg font-bold text-blue-800 mb-2">💡 راهنمای استفاده</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
          <div>🖱️ برای مشاهده جزئیات روی هر گره کلیک کنید</div>
          <div>🔍 برای جستجو در نام‌ها از کادر بالا استفاده کنید</div>
          <div>🔍 برای بزرگ/کوچک کردن نمودار از ماوس استفاده کنید</div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTree;