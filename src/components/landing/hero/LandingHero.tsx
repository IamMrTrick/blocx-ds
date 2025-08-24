import React from 'react';
import './LandingHero.scss';
import { Section, Row, Col } from '@/components/layout';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export type LandingHeroProps = {
  title: string;
  subtitle?: string;
  tags?: string[];
  primaryCta?: { label: string; href?: string };
  secondaryCta?: { label: string; href?: string };
};

export const LandingHero: React.FC<LandingHeroProps> = ({
  title,
  subtitle,
  tags = [],
  primaryCta,
  secondaryCta,
}) => {
  return (
    <Section variant="hero" background="surface">
      <Row justify="center" align="center" gap="lg">
        <Col md={10} lg={8}>
          <div className="landing-hero">
            <div className="landing-hero__eyebrow">
              <Badge>v1 • Token-driven</Badge>
            </div>
            <Heading level={1} size="h1" className="landing-hero__title">{title}</Heading>
            {subtitle && (
              <Text size="lg" className="landing-hero__subtitle">{subtitle}</Text>
            )}
            {(primaryCta || secondaryCta) && (
              <div className="landing-hero__cta">
                {primaryCta && (
                  <a href={primaryCta.href} aria-label={primaryCta.label}>
                    <Button variant="primary" size="l">{primaryCta.label}</Button>
                  </a>
                )}
                {secondaryCta && (
                  <a href={secondaryCta.href} aria-label={secondaryCta.label}>
                    <Button variant="ghost" size="l">{secondaryCta.label}</Button>
                  </a>
                )}
              </div>
            )}
            {tags.length > 0 && (
              <div className="landing-hero__tags">
                {tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
    </Section>
  );
};
