import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { select as d3_select } from "d3-selection";
import {
  sankey as d3_sankey,
  sankeyLinkHorizontal as d3_sankeyLinkHorizontal,
  sankeyCenter as d3_sankeyCenter,
} from "d3-sankey";
import { easeQuadInOut as d3_easeQuadInOut } from "d3-ease";
import { scaleOrdinal as d3_scaleOrdinal } from "d3-scale";
import "d3-transition";

const COLORS = [
  "#F2C4DE",
  "#71B1D9",
  "#AED8F2",
  "#F2DEA2",
  "#F2CDC4",
  "#A9B5D9",
  "#FFB6A3",
  "#F29472",
  "#F2D0D9",
  "#D1EBD8",
  "#8596A6",
  "#F0BC68",
  "#F2A0A0",
];

@Component({
  selector: "sankey-diagram",
  template: ``,
})
export class SankeyComponent implements OnInit, OnChanges {
  @Input() data;
  @Input() width: number = 900;
  @Input() height: number = 600;

  private chart;
  private svg;
  private container;
  private links;
  private nodes;
  private sankey;
  private colors;
  private adminDivContainer;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.adminDivContainer = document.getElementById("admin-sidenav-content");
    this.chart = d3_select(this.element.nativeElement).attr(
      "aria-hidden",
      "true"
    );

    this.svg = this.chart
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet");

    this.container = this.svg.append("g").attr("class", "container");

    this.links = this.container.append("g").attr("class", "links");
    this.nodes = this.container.append("g").attr("class", "nodes");

    this.update();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes.data && !changes.data.firstChange) ||
      (changes.width && !changes?.width.firstChange) ||
      (changes.height && !changes?.height.firstChange)
    ) {
      this.update();
    }
  }

  update() {
    this.svg.attr("width", this.width).attr("height", this.height);

    const labels = new Set();
    this.data.nodes.map((node) => labels.add(node.id));
    const labelsArray = Array.from(labels);
    this.colors = d3_scaleOrdinal().domain(labelsArray).range(COLORS);

    this.sankey = d3_sankey()
      .nodeId((d: any) => d.id)
      .nodeWidth(80)
      .nodeAlign(d3_sankeyCenter)
      .nodePadding(40)
      .size([this.width - 50, this.height - 50])
      .iterations(50);

    this.sankey(this.data);

    // LINKS
    this.links
      .attr("fill", "none")
      .selectAll("path")
      .data(this.data.links)
      .join(
        (enter) => {
          return enter
            .append("path")
            .attr("d", d3_sankeyLinkHorizontal())
            .attr("stroke-width", (d) => d.width)
            .attr("stroke", (d) => {
              return this.colors(d.source.id);
            })
            .style("opacity", 0.3)
            .style("mix-blend-mode", "multiply");
        },
        (update) =>
          update
            .transition()
            .duration(1000)
            .ease(d3_easeQuadInOut)
            .attr("d", d3_sankeyLinkHorizontal())
            .attr("stroke-width", (d) => d.width),

        (exit) => {
          return exit.remove();
        }
      )
      .on("mouseenter", (event) => this.onMouseEnterLink(event))
      .on("mouseleave", () => this.onMouseLeaveLink())
      .on("mousemove", (event, data) => this.onMouseMoveLink(event, data));

    // NODES
    this.nodes
      .selectAll("rect")
      .data(this.data.nodes)
      .join(
        (enter) => {
          return enter
            .append("rect")
            .attr("x", (d) => d.x0)
            .attr("y", (d) => d.y0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("width", () => this.sankey.nodeWidth())
            .attr("fill", (d) => {
              return this.colors(d.id);
            });
        },
        (update) => {
          return update
            .transition()
            .duration(1000)
            .ease(d3_easeQuadInOut)
            .attr("x", (d) => d.x0)
            .attr("y", (d) => d.y0)
            .attr("height", (d) => d.y1 - d.y0)
            .attr("width", () => this.sankey.nodeWidth());
        },
        (exit) => {
          return exit.remove();
        }
      );

    this.nodes
      .selectAll("text")
      .data(this.data.nodes)
      .join(
        (enter) =>
          enter
            .append("text")
            .text((d) => `${d.name}`)
            .attr("font-weight", "bold")
            .attr("text-anchor", "middle")
            .attr("x", (d) => {
              return d.x0 + (d.x1 - d.x0) / 2;
            })
            .attr("y", (d) => {
              return d.y0 + (d.y1 - d.y0) / 2;
            })
            .attr("dy", "0.35em"),
        (update) =>
          update
            .transition()
            .duration(1000)
            .ease(d3_easeQuadInOut)
            .attr("x", (d) => {
              return d.x0 + (d.x1 - d.x0) / 2;
            })
            .attr("y", (d) => {
              return d.y0 + (d.y1 - d.y0) / 2;
            })
      )
      .on("mouseleave", () => this.onMouseLeaveLink())
      .on("mousemove", (event, data) => this.onMouseMoveNodeText(event, data));
  }

  onMouseEnterLink(event) {
    const element = d3_select(event.target);
    element.style("opacity", 1).style("mix-blend-mode", null);
  }

  onMouseMoveLink(event, data) {
    const tooltip = d3_select("#tooltip");
    tooltip
      .style("visibility", "visible")
      .style("top", `${event.layerY + this.adminDivContainer.scrollTop + 10}px`)
      .style("left", `${event.layerX + 10}px`)
      .text(`${data.value} usages - ${data.percentage.toFixed(2)} %`);
  }

  onMouseMoveNodeText(event, data) {
    const tooltip = d3_select("#tooltip");
    tooltip
      .style("visibility", "visible")
      .style("top", `${event.layerY + this.adminDivContainer.scrollTop + 10}px`)
      .style("left", `${event.layerX + 10}px`)
      .text(`${data.name}`);
  }

  onMouseLeaveLink() {
    this.links.selectAll("path").style("opacity", 0.3);
    const tooltip = d3_select("#tooltip");
    tooltip.style("visibility", "hidden");
  }
}
