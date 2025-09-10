'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

export type TreeNode = {
  id: number
  name: string
  family_name?: string
  father_name?: string | null
  children?: TreeNode[]
}

type Props = {
  data: TreeNode
  width?: number
  height?: number
}

export default function PersonalTree({ data, width = 960, height = 560 }: Props) {
  const ref = useRef<SVGSVGElement | null>(null)

  useEffect(() => {
    if (!ref.current) return

    const svg = d3.select(ref.current)
    svg.selectAll('*').remove()

    const margin = { top: 40, right: 120, bottom: 40, left: 120 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const root = d3.hierarchy<TreeNode>(data)
    const treeLayout = d3.tree<TreeNode>().size([innerHeight, innerWidth])
    treeLayout(root)

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', `translate(${event.transform.x + margin.left},${event.transform.y + margin.top}) scale(${event.transform.k})`)
      })

    d3.select(ref.current).call(zoom as d3.ZoomBehavior<SVGSVGElement, unknown>)

    // links
    g.append('g')
      .selectAll('path')
      .data(root.links())
      .enter()
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', '#CBD5E1')
      .attr('stroke-width', 2)
      .attr('d', d3.linkHorizontal<any, any>()
        .x((d: any) => d.y)
        .y((d: any) => d.x)
      )

    // nodes
    const node = g.append('g')
      .selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('transform', (d) => `translate(${d.y},${d.x})`)

    node.append('rect')
      .attr('x', -70)
      .attr('y', -22)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('width', 140)
      .attr('height', 44)
      .attr('fill', (d) => d.depth === 0 ? 'url(#gradRoot)' : '#ffffff')
      .attr('stroke', '#E5E7EB')
      .attr('stroke-width', 1)
      .attr('filter', 'url(#shadow)')

    node.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', (d) => d.depth === 0 ? '#ffffff' : '#111827')
      .style('font-size', '12px')
      .text((d) => `${d.data.name}${d.data.family_name ? ' ' + d.data.family_name : ''}`)

    // defs for gradients & shadow
    const defs = svg.append('defs')
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'gradRoot')
      .attr('x1', '0%').attr('x2', '100%').attr('y1', '0%').attr('y2', '0%')
    linearGradient.append('stop').attr('offset', '0%').attr('stop-color', '#3B82F6')
    linearGradient.append('stop').attr('offset', '100%').attr('stop-color', '#6366F1')

    const filter = defs.append('filter').attr('id', 'shadow').attr('height', '130%')
    filter.append('feDropShadow')
      .attr('dx', 0)
      .attr('dy', 1)
      .attr('stdDeviation', 1.5)
      .attr('flood-color', '#000000')
      .attr('flood-opacity', 0.1)

  }, [data, width, height])

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <svg ref={ref} className="w-full" style={{ minHeight: 400 }} />
      <div className="p-3 text-xs text-gray-500 text-center">
        برای حرکت، بکشید و برای زوم، اسکرول کنید
      </div>
    </div>
  )
}


