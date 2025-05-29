"use client";

import { Card, Container, FormControl, Grid, TextField } from "@mui/material";
import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

export default function UserformVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [userform, setUserform] = useState<any>();
  const [userformInputValue, setUserformInputValue] = useState<string>("{}");

  useEffect(() => {
    if (!userform) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      return { width: canvas.width, height: canvas.height };
    }

    let { width, height } = resizeCanvas();

    window.addEventListener("resize", () => {
      const size = resizeCanvas();
      width = size.width;
      height = size.height;
      simulation.force("x", d3.forceX(width / 2).strength(0.05));
      simulation.alpha(1).restart();
    });

    const r = 30;
    const textPadding = 60;

    const APP_NODE_ID = "Application";

    const propertyNodes =
      userform?.values?.["Home Loan Multiple"]?.map((property, idx) => ({
        type: "Property",
        name: `${property.amount}`,
        color: "navy",
        id: property.id,
        parent: userform?.SID,
      })) || [];

    const loanNodes =
      Object.entries(
        userform?.values?.["Multiple Product Selection"] ?? {}
      )?.flatMap(([propertyId, propertyLoan]) => {
        return propertyLoan?.splitLoanData?.map((loan) => ({
          name: `${loan.loanAmount}`,
          color: "green",
          id: `${loan.id}`,
          parent: propertyId,
          type: "Loan",
        }));
      }) || [];

    const nodes = [
      {
        type: "Application",
        id: userform?.SID,
        name: APP_NODE_ID,
        color: "black",
        parent: null,
      },
      ...propertyNodes,
      ...loanNodes,
    ];

    const links = nodes
      .filter((node) => node.parent)
      .map((node) => ({
        source: node.parent,
        target: node.id,
      }));

    const graph = { nodes, links };

    const topLevelY = 0;
    const secondLevelY = 250;
    const thirdLevelY = 500;

    const simulation = d3
      .forceSimulation()
      .force("x", d3.forceX(width / 2).strength(0.05))
      .force("collide", d3.forceCollide(r + textPadding))
      .force("charge", d3.forceManyBody().strength(-200))
      .force(
        "link",
        d3.forceLink().id((node: any) => node.id)
      )
      .on("tick", update);

    simulation.nodes(graph.nodes);
    simulation.force("link")?.links(graph.links);

    let zoomScale = 1;
    let translateX = 0;
    let translateY = 0;

    function update() {
      ctx.clearRect(0, 0, width, height);

      graph.nodes.forEach((d) => {
        if (d.type === "Application") d.y = topLevelY;
        else if (d.type.startsWith("Property")) d.y = secondLevelY;
        else if (d.type.startsWith("Loan")) d.y = thirdLevelY;
      });

      const xs = graph.nodes.map((d) => d.x);
      const ys = graph.nodes.map((d) => d.y);
      const minX = Math.min(...xs) - r - 70;
      const maxX = Math.max(...xs) + r + 70;
      const minY = Math.min(...ys) - r - 20;
      const maxY = Math.max(...ys) + r + 20;

      const boxWidth = maxX - minX;
      const boxHeight = maxY - minY;

      const scaleX = width / boxWidth;
      const scaleY = height / boxHeight;
      zoomScale = Math.min(1, Math.min(scaleX, scaleY));

      translateX = width / 2 - ((minX + maxX) / 2) * zoomScale;
      translateY = height / 2 - ((minY + maxY) / 2) * zoomScale;

      ctx.save();
      ctx.translate(translateX, translateY);
      ctx.scale(zoomScale, zoomScale);

      ctx.beginPath();
      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "blue";
      graph.links.forEach(drawLink);
      ctx.stroke();

      ctx.globalAlpha = 1;
      graph.nodes.forEach(drawNode);

      ctx.restore();
    }

    function dragsubject(event: any) {
      return simulation.find(event.x, event.y, r);
    }

    function drawNode(d: any) {
      ctx.beginPath();
      ctx.fillStyle = d.color;
      ctx.moveTo(d.x, d.y);
      ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.font = "14px sans-serif";
      ctx.textBaseline = "middle";
      ctx.fillText(d.name, d.x + r + 10, d.y);
    }

    function drawLink(l: any) {
      ctx.moveTo(l.source.x, l.source.y);
      ctx.lineTo(l.target.x, l.target.y);
    }

    d3.select(canvas).call(
      d3
        .drag()
        .container(canvas)
        .subject(dragsubject)
        .on("start", (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.subject.x;
          event.subject.fy = event.subject.y;
        })
        .on("drag", (event) => {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
        .on("end", (event) => {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;
        })
    );

    update();
  }, [userform]);

  const handleUserFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUserform = e.target.value;
    setUserformInputValue(newUserform);
    setUserform((prev: any) => {
      try {
        return JSON.parse(newUserform);
      } catch (error) {
        console.warn("Failed to parse userform JSON:", error);
        return prev; // Keep the previous state if parsing fails
      }
    });
  };

  return (
    <Container sx={{ marginTop: 4 }}>
      <Card>
        <Grid container spacing={4} paddingInline={6} paddingBlock={2}>
          <Grid size={{ xs: 12 }}>
            <h1>User Form Visualizer</h1>
            <FormControl fullWidth>
              <TextField
                label="Userform JSON Input"
                multiline
                rows={10}
                variant="outlined"
                sx={{ marginTop: 2, marginBottom: 2 }}
                placeholder="Paste your userform JSON here"
                inputProps={{ style: { fontFamily: "monospace" } }}
                autoFocus
                value={userformInputValue}
                onChange={handleUserFormChange}
              />
            </FormControl>
            <h1>Graph Visualization</h1>
            <canvas
              ref={canvasRef}
              style={{ background: "white", width: "100%", display: "block" }}
            />
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
}
