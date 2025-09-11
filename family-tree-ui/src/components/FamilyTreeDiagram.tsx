'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import api from '@/lib/api';

interface FamilyMember {
  id: number;
  name: string;
  family_name: string;
  father_name: string | null;
  father_id: number | null;
  children?: FamilyMember[];
}

const FamilyTreeDiagram: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [familyData, setFamilyData] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFamilyData();
  }, []);

  useEffect(() => {
    if (familyData.length > 0) {
      createTreeVisualization();
    }
  }, [familyData]);

  const fetchFamilyData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/family-members');
      setFamilyData(response.data);
    } catch (err) {
      setError('خطا در بارگذاری داده‌های خانواده');
      console.error('Error fetching family data:', err);
    } finally {
      setLoading(false);
    }
  };

  const buildTreeData = (members: FamilyMember[]) => {
    // Find root members (those without father)
    const rootMembers = members.filter(member => !member.father_id);
    
    if (rootMembers.length === 0) return null;

    // Build hierarchy
    const buildHierarchy = (member: FamilyMember): any => {
      const children = members.filter(m => m.father_id === member.id);
      return {
        name: member.name,
        family_name: member.family_name,
        id: member.id,
        children: children.length > 0 ? children.map(buildHierarchy) : []
      };
    };

    // If multiple roots, create a virtual root
    if (rootMembers.length > 1) {
      return {
        name: 'خانواده',
        children: rootMembers.map(buildHierarchy)
      };
    }

    return buildHierarchy(rootMembers[0]);
  };

  const createTreeVisualization = () => {
    if (!svgRef.current || familyData.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const treeData = buildTreeData(familyData);
    if (!treeData) return;

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 600;

    svg.attr("width", width).attr("height", height);

    // Create tree layout
    const tree = d3.tree<typeof treeData>()
      .size([width - 100, height - 100]);

    const root = d3.hierarchy(treeData);
    tree(root);

    // Create links
    const links = svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('d', d3.linkVertical<any, any>()
        .x((d: any) => d.x + 50)
        .y((d: any) => d.y + 50)
      )
      .style('fill', 'none')
      .style('stroke', '#999')
      .style('stroke-width', '2px');

    // Create nodes
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.x + 50},${d.y + 50})`);

    // Add circles for nodes
    nodes.append('circle')
      .attr('r', 20)
      .style('fill', (d: any) => {
        if (d.depth === 0) return '#e74c3c'; // Root - Red
        if (d.depth === 1) return '#3498db'; // First level - Blue
        if (d.depth === 2) return '#2ecc71'; // Second level - Green
        return '#f39c12'; // Other levels - Orange
      })
      .style('stroke', '#fff')
      .style('stroke-width', '3px');

    // Add text labels
    nodes.append('text')
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#fff')
      .text((d: any) => d.data.name);

    // Add family name labels below
    nodes.append('text')
      .attr('dy', '1.5em')
      .attr('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('fill', '#666')
      .text((d: any) => d.data.family_name || '');

    // Add hover effects
    nodes
      .on('mouseover', function(event, d: any) {
        d3.select(this).select('circle')
          .style('stroke-width', '5px')
          .style('stroke', '#333');
        
        // Show tooltip
        const tooltip = svg.append('g')
          .attr('class', 'tooltip')
          .attr('transform', `translate(${d.x + 50},${d.y + 50})`);
        
        tooltip.append('rect')
          .attr('x', -60)
          .attr('y', -40)
          .attr('width', 120)
          .attr('height', 30)
          .style('fill', 'rgba(0,0,0,0.8)')
          .style('rx', 5);
        
        tooltip.append('text')
          .attr('text-anchor', 'middle')
          .attr('dy', '-0.5em')
          .style('fill', '#fff')
          .style('font-size', '12px')
          .text(`${d.data.name} ${d.data.family_name || ''}`);
      })
      .on('mouseout', function() {
        d3.select(this).select('circle')
          .style('stroke-width', '3px')
          .style('stroke', '#fff');
        
        svg.selectAll('.tooltip').remove();
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="mr-3 text-gray-600">در حال بارگذاری نمودار درختی...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-4xl mb-4">❌</div>
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={fetchFamilyData}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          تلاش مجدد
        </button>
      </div>
    );
  }

  if (familyData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🌳</div>
        <p className="text-gray-600 mb-4">هنوز هیچ عضو خانواده‌ای ثبت نشده است</p>
        <p className="text-sm text-gray-500">از کد دعوت خود برای اضافه کردن اعضای خانواده استفاده کنید</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Tree Visualization */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 overflow-x-auto">
        <div className="flex justify-center">
          <svg ref={svgRef} className="border border-gray-200 rounded-lg bg-white"></svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center space-x-6 space-x-reverse">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">ریشه خانواده</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">نسل اول</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">نسل دوم</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">نسل‌های بعدی</span>
        </div>
      </div>

      {/* Family Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {familyData.length}
          </div>
          <div className="text-sm text-blue-700">کل اعضا</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {familyData.filter(m => !m.father_id).length}
          </div>
          <div className="text-sm text-green-700">ریشه خانواده</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {Math.max(...familyData.map(m => {
              let generation = 1;
              let current = m;
              while (current.father_id) {
                const father = familyData.find(f => f.id === current.father_id);
                if (father) {
                  current = father;
                  generation++;
                } else break;
              }
              return generation;
            }), 1)}
          </div>
          <div className="text-sm text-purple-700">عمق نسل</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {familyData.filter(m => m.invite_code).length}
          </div>
          <div className="text-sm text-orange-700">دارای کد دعوت</div>
        </div>
      </div>
    </div>
  );
};

export default FamilyTreeDiagram;