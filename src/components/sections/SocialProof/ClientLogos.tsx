"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTheme } from "@/hooks/useTheme";
import { portfolioData } from "@/data/portfolio";

interface ClientLogoProps {
  client: {
    name: string;
    logo: string;
    tier: "enterprise" | "growth" | "startup";
    project: {
      description: string;
      value: string;
      duration: string;
    };
  };
  speed: number;
  direction: "left" | "right";
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  client: ClientLogoProps["client"] | null;
}

const ClientLogo: React.FC<ClientLogoProps> = ({
  client,
  speed,
  direction,
}) => {
  const { currentTheme } = useTheme();
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    client: null,
  });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      client,
    });
  };

  const handleMouseLeave = () => {
    setTooltip({
      visible: false,
      x: 0,
      y: 0,
      client: null,
    });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "enterprise":
        return "var(--current-accent)";
      case "growth":
        return "var(--current-highlight)";
      case "startup":
        return "var(--current-success)";
      default:
        return "var(--current-text)";
    }
  };

  return (
    <>
      <div
        className={`client-logo client-logo--${currentTheme} client-logo--${client.tier}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          {
            "--logo-speed": `${speed}s`,
            "--logo-direction": direction === "left" ? "normal" : "reverse",
          } as React.CSSProperties
        }
      >
        <div className="client-logo__container">
          <div className="client-logo__image">
            {/* Using emoji as placeholder for logos */}
            <span className="client-logo__emoji">
              {client.tier === "enterprise"
                ? "🏢"
                : client.tier === "growth"
                  ? "📈"
                  : "🚀"}
            </span>
          </div>
          <div className="client-logo__name">{client.name}</div>
          <div
            className="client-logo__tier"
            style={{ backgroundColor: getTierColor(client.tier) }}
          >
            {client.tier}
          </div>
        </div>
        <div className="client-logo__glow"></div>
        <div className="client-logo__scan-line"></div>
      </div>

      {/* Tooltip */}
      {tooltip.visible && tooltip.client && (
        <div
          className={`client-tooltip client-tooltip--${currentTheme}`}
          style={{
            left: tooltip.x,
            top: tooltip.y,
            transform: "translateX(-50%) translateY(-100%)",
          }}
        >
          <div className="client-tooltip__header">
            <h4 className="client-tooltip__name">{tooltip.client.name}</h4>
            <span
              className="client-tooltip__tier"
              style={{ backgroundColor: getTierColor(tooltip.client.tier) }}
            >
              {tooltip.client.tier}
            </span>
          </div>
          <div className="client-tooltip__content">
            <p className="client-tooltip__description">
              {tooltip.client.project.description}
            </p>
            <div className="client-tooltip__details">
              <div className="client-tooltip__value">
                <span className="client-tooltip__label">Project Value:</span>
                <span className="client-tooltip__amount">
                  {tooltip.client.project.value}
                </span>
              </div>
              <div className="client-tooltip__duration">
                <span className="client-tooltip__label">Duration:</span>
                <span className="client-tooltip__time">
                  {tooltip.client.project.duration}
                </span>
              </div>
            </div>
          </div>
          <div className="client-tooltip__arrow"></div>
        </div>
      )}
    </>
  );
};

export const ClientLogos: React.FC = () => {
  const { currentTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Extended client data with more entries for carousel effect
  const extendedClients = [
    ...portfolioData.socialProof.clients,
    // Add more clients for better carousel effect
    {
      name: "FinTech Solutions",
      logo: "/images/clients/fintech.svg",
      tier: "enterprise" as const,
      project: {
        description: "Banking platform modernization",
        value: "$1.8M",
        duration: "24 months",
      },
    },
    {
      name: "HealthTech Inc",
      logo: "/images/clients/healthtech.svg",
      tier: "growth" as const,
      project: {
        description: "Patient management system",
        value: "$750K",
        duration: "15 months",
      },
    },
    {
      name: "EduStart",
      logo: "/images/clients/edustart.svg",
      tier: "startup" as const,
      project: {
        description: "E-learning platform development",
        value: "$200K",
        duration: "8 months",
      },
    },
    {
      name: "RetailMax",
      logo: "/images/clients/retailmax.svg",
      tier: "enterprise" as const,
      project: {
        description: "E-commerce platform overhaul",
        value: "$3.2M",
        duration: "20 months",
      },
    },
    {
      name: "CloudVenture",
      logo: "/images/clients/cloudventure.svg",
      tier: "growth" as const,
      project: {
        description: "Infrastructure automation",
        value: "$600K",
        duration: "10 months",
      },
    },
  ];

  // Create three tiers of logos with different speeds and directions
  const enterpriseClients = extendedClients.filter(
    (client) => client.tier === "enterprise"
  );
  const growthClients = extendedClients.filter(
    (client) => client.tier === "growth"
  );
  const startupClients = extendedClients.filter(
    (client) => client.tier === "startup"
  );

  // Duplicate clients for seamless loop
  const duplicateArray = (arr: typeof extendedClients, times: number = 3) => {
    return Array(times).fill(arr).flat();
  };

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const tracks = container.querySelectorAll(".client-logos__track");
    tracks.forEach((track) => {
      if (isPaused) {
        (track as HTMLElement).style.animationPlayState = "paused";
      } else {
        (track as HTMLElement).style.animationPlayState = "running";
      }
    });
  }, [isPaused]);

  return (
    <div className="social-proof__clients">
      <h3 className="social-proof__section-title">
        Trusted by Industry Leaders
      </h3>

      <div
        ref={containerRef}
        className={`client-logos client-logos--${currentTheme}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Enterprise Tier - Top track, slow speed, left direction */}
        <div className="client-logos__track client-logos__track--enterprise">
          <div className="client-logos__track-content">
            {duplicateArray(enterpriseClients).map((client, index) => (
              <ClientLogo
                key={`enterprise-${index}`}
                client={client}
                speed={60}
                direction="left"
              />
            ))}
          </div>
        </div>

        {/* Growth Tier - Middle track, medium speed, right direction */}
        <div className="client-logos__track client-logos__track--growth">
          <div className="client-logos__track-content">
            {duplicateArray(growthClients).map((client, index) => (
              <ClientLogo
                key={`growth-${index}`}
                client={client}
                speed={45}
                direction="right"
              />
            ))}
          </div>
        </div>

        {/* Startup Tier - Bottom track, fast speed, left direction */}
        <div className="client-logos__track client-logos__track--startup">
          <div className="client-logos__track-content">
            {duplicateArray(startupClients).map((client, index) => (
              <ClientLogo
                key={`startup-${index}`}
                client={client}
                speed={30}
                direction="left"
              />
            ))}
          </div>
        </div>

        {/* Background effects */}
        <div className="client-logos__background">
          <div className="client-logos__grid"></div>
          <div className="client-logos__particles"></div>
        </div>

        {/* Track labels */}
        <div className="client-logos__labels">
          <div className="client-logos__label client-logos__label--enterprise">
            <span className="client-logos__label-text">ENTERPRISE</span>
            <span className="client-logos__label-count">
              {enterpriseClients.length} CLIENTS
            </span>
          </div>
          <div className="client-logos__label client-logos__label--growth">
            <span className="client-logos__label-text">GROWTH</span>
            <span className="client-logos__label-count">
              {growthClients.length} CLIENTS
            </span>
          </div>
          <div className="client-logos__label client-logos__label--startup">
            <span className="client-logos__label-text">STARTUP</span>
            <span className="client-logos__label-count">
              {startupClients.length} CLIENTS
            </span>
          </div>
        </div>
      </div>

      {/* Stats summary */}
      <div className="client-logos__stats">
        <div className="client-logos__stat">
          <span className="client-logos__stat-value">
            $
            {extendedClients
              .reduce((sum, client) => {
                const value = parseFloat(
                  client.project.value.replace(/[$MK,]/g, "")
                );
                const multiplier = client.project.value.includes("M")
                  ? 1000000
                  : 1000;
                return sum + value * multiplier;
              }, 0)
              .toLocaleString()}
          </span>
          <span className="client-logos__stat-label">Total Project Value</span>
        </div>
        <div className="client-logos__stat">
          <span className="client-logos__stat-value">
            {extendedClients.length}+
          </span>
          <span className="client-logos__stat-label">Satisfied Clients</span>
        </div>
        <div className="client-logos__stat">
          <span className="client-logos__stat-value">99.9%</span>
          <span className="client-logos__stat-label">Success Rate</span>
        </div>
      </div>
    </div>
  );
};

export default ClientLogos;
