import React, { useState } from 'react';
import { BrandLogo } from '../components/common/BrandLogo';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Panel } from '../components/ui/Panel';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { SeverityChip } from '../components/ui/SeverityChip';
import { Modal } from '../components/ui/Modal';
import { Tooltip } from '../components/ui/Tooltip';
import { Skeleton } from '../components/ui/Skeleton';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Search, ShieldAlert, Zap, Terminal } from 'lucide-react';
import { useToast } from '../components/common/Toast';

export const Styleguide: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const { showToast } = useToast();

  const colorTokens = [
    { name: '--background', hex: '#080D18', role: 'Default dark canvas background' },
    { name: '--background-secondary', hex: '#101827', role: 'Secondary dark surface / inputs' },
    { name: '--surface', hex: '#141F30', role: 'Card / Panel container surface' },
    { name: '--surface-elevated', hex: '#1B293B', role: 'Elevated hover surfaces & tooltips' },
    { name: '--accent-primary', hex: '#22D3EE', role: 'Cyan: Primary CTAs, active states, focus' },
    { name: '--accent-secondary', hex: '#2DD4BF', role: 'Teal: Secondary metrics, benign indicators' },
    { name: '--text-primary', hex: '#F1F5F9', role: 'High-contrast primary content text' },
    { name: '--text-secondary', hex: '#94A3B8', role: 'Labels, metadata, supporting text' },
    { name: '--risk-high', hex: '#F87171', role: 'Critical threat findings & urgency alert' },
    { name: '--risk-warning', hex: '#FBBF24', role: 'Suspicious / medium-risk anomalies' },
    { name: '--risk-low', hex: '#2DD4BF', role: 'Lower concern / legitimate benchmarks' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="pb-6 border-b border-[rgba(148,163,184,0.16)] space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#22D3EE]/10 border border-[#22D3EE]/30 text-xs font-mono text-[#22D3EE]">
          <Terminal className="w-3.5 h-3.5" />
          <span>CINEMATIC SOC DESIGN SYSTEM // TOKEN AUDIT</span>
        </div>
        <h1 className="font-display font-black text-4xl uppercase tracking-tight text-[#F1F5F9]">
          Design System & UI Component Spec
        </h1>
        <p className="text-sm text-[#94A3B8]">
          Single source of truth for color tokens, typography scales, accessibility contrasts, and reusable SOC components.
        </p>
      </div>

      {/* Brand Logo Spec */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          1. Brand Identity & Vector Marks
        </h2>
        <Card className="flex flex-wrap items-center gap-12 p-8">
          <div>
            <span className="text-xs font-mono text-[#94A3B8] block mb-3">Large Lockup</span>
            <BrandLogo size="lg" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#94A3B8] block mb-3">Medium (Header Default)</span>
            <BrandLogo size="md" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#94A3B8] block mb-3">Mark Only</span>
            <BrandLogo size="md" showWordmark={false} />
          </div>
        </Card>
      </section>

      {/* Color Palette Spec */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          2. Color Tokens & Contrast Ratios
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {colorTokens.map((token, i) => (
            <Card key={i} className="space-y-3 p-4">
              <div
                className="w-full h-14 rounded-xl border border-white/10 shadow-inner flex items-center justify-center font-mono text-xs font-bold"
                style={{
                  backgroundColor: token.hex,
                  color: token.hex === '#22D3EE' || token.hex === '#2DD4BF' || token.hex === '#F1F5F9' || token.hex === '#FBBF24' ? '#080D18' : '#F1F5F9',
                }}
              >
                {token.hex}
              </div>
              <div>
                <div className="font-mono text-xs font-bold text-[#F1F5F9]">{token.name}</div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5 leading-snug">{token.role}</div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          3. Typography Scale (Space Grotesk + Inter + JetBrains Mono)
        </h2>
        <Card className="space-y-6 p-8">
          <div className="space-y-1">
            <span className="text-xs font-mono text-[#22D3EE]">Space Grotesk Display // 56px - 72px</span>
            <div className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight text-[#F1F5F9]">
              Don't Just Detect The Scam. Expose The Evidence.
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-[#22D3EE]">Space Grotesk Page Heading // 32px</span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl uppercase tracking-wide text-[#F1F5F9]">
              Incident Command Center Telemetry
            </h2>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-[#22D3EE]">Inter Body Base // 16px (15px mobile)</span>
            <p className="font-sans text-base text-[#F1F5F9] max-w-3xl leading-relaxed">
              ScamTrace AI breaks down coercive messages, dissects fraudulent URLs lexically without exposing your network, isolates psychological manipulation tactics, and arms you with a defensive user safety playbook.
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs font-mono text-[#22D3EE]">JetBrains Mono Metadata // 12px</span>
            <div className="font-mono text-xs text-[#94A3B8] bg-[#101827] p-3 rounded-xl border border-[rgba(148,163,184,0.16)]">
              SHA256: 4a8e9f2b1c7d3e5a &bull; CASE_ID: inv_8f902a &bull; SENDER_ID: +91 98***-***12
            </div>
          </div>
        </Card>
      </section>

      {/* Severity Chips (Never color alone) */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          4. Severity Chips (Rule: Icon + Unambiguous Text Label)
        </h2>
        <Card className="p-8 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <SeverityChip level="High concern" score={88.4} size="lg" />
            <SeverityChip level="Suspicious" score={64.2} size="lg" />
            <SeverityChip level="Lower concern" score={12.0} size="lg" />
            <SeverityChip level="Insufficient evidence" size="lg" />
          </div>
          <p className="text-xs text-[#94A3B8] mt-2">
            Every chip includes an explicit SVG icon, standardized text label, and optional numeric risk score.
          </p>
        </Card>
      </section>

      {/* Buttons & Interactive States */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          5. Buttons & Interactive Controls
        </h2>
        <Card className="p-8 space-y-6">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={<Zap className="w-4 h-4" />}>
              Primary Action (Cyan)
            </Button>
            <Button variant="secondary" icon={<ShieldAlert className="w-4 h-4" />}>
              Secondary Action
            </Button>
            <Button variant="outline">
              Outline Action
            </Button>
            <Button variant="ghost">
              Ghost Action
            </Button>
            <Button variant="danger">
              Danger Action
            </Button>
            <Button variant="primary" loading>
              Loading State
            </Button>
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-[rgba(148,163,184,0.16)]">
            <Button
              variant="outline"
              onClick={() => setModalOpen(true)}
            >
              Open Interactive Modal Demo
            </Button>
            <Button
              variant="secondary"
              onClick={() => showToast('Forensic record copied to clipboard', 'success')}
            >
              Trigger Success Toast
            </Button>
            <Tooltip content="Deterministic mathematical feature">
              <span className="text-xs font-mono text-[#22D3EE] underline decoration-dotted cursor-help">
                Hover for Tooltip
              </span>
            </Tooltip>
          </div>
        </Card>
      </section>

      {/* Form Controls & Skeletons */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          6. Form Inputs & SOC Telemetry Tables
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-[#F1F5F9]">Form Inputs</h3>
            <Input
              label="Investigation Query"
              placeholder="Enter message text or URL..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              prefixIcon={<Search className="w-4 h-4" />}
              helperText="Zero external network requests are made."
            />
            <Input
              label="Error State Demonstration"
              defaultValue="malformed_domain"
              error="Valid URL scheme required (e.g. http:// or https://)"
            />
          </Card>

          <Panel title="Live Telemetry Skeletons" badge="LOADING SPEC" statusDot="cyan">
            <div className="space-y-3">
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="rectangular" height={40} />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
                <Skeleton variant="rectangular" height={60} />
              </div>
            </div>
          </Panel>
        </div>
      </section>

      {/* Badges and Data Table Spec */}
      <section className="space-y-6">
        <h2 className="font-display font-bold text-2xl text-[#F1F5F9] uppercase tracking-wide">
          7. Badges & SOC Incident Table
        </h2>
        <Card className="p-6 space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="cyan">SHA256_HASH</Badge>
            <Badge variant="teal">CALIBRATED_ML</Badge>
            <Badge variant="neutral">OFFLINE_LEXICAL</Badge>
            <Badge variant="outline">LOCAL_GEMMA_4</Badge>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Investigation ID</TableHead>
                <TableHead>Threat Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Confidence</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-mono text-[#22D3EE]">#INV-94021</TableCell>
                <TableCell>Bank KYC Coercion</TableCell>
                <TableCell><SeverityChip level="High concern" size="sm" /></TableCell>
                <TableCell className="font-mono">98.2%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-mono text-[#22D3EE]">#INV-94022</TableCell>
                <TableCell>Customs Delivery Duty</TableCell>
                <TableCell><SeverityChip level="Suspicious" size="sm" /></TableCell>
                <TableCell className="font-mono">67.5%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </section>

      {/* Modal Demo */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Interactive Forensic Dialog"
        description="Modal overlay with escape listener, accessible focus trap, and backdrop blur."
      >
        <div className="space-y-4 text-xs text-[#94A3B8]">
          <p>
            This component enforces strict accessibility semantics (<code>role="dialog"</code>, <code>aria-modal="true"</code>) with seamless keyboard interaction.
          </p>
          <div className="flex justify-end gap-3 pt-3">
            <Button variant="secondary" size="sm" onClick={() => setModalOpen(false)}>
              Dismiss
            </Button>
            <Button variant="primary" size="sm" onClick={() => setModalOpen(false)}>
              Confirm Action
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
