import { describe, expect, it } from 'vitest';

import {
  assessTutorScope,
  buildPedagogicalSystemPrompt,
  parseTutorAgentDecision,
  resolveSubjectKey,
} from '../src/modules/tutoring/domain/policies/pedagogical-policy.js';

const baseCtx = {
  subject: 'Historia',
  difficulty: 'basic' as const,
  userRole: 'student' as const,
  explanationStyle: 'simple' as const,
  tutorPersonality: 'friendly' as const,
};

describe('resolveSubjectKey', () => {
  it('maps Spanish and English labels', () => {
    expect(resolveSubjectKey('Historia')).toBe('history');
    expect(resolveSubjectKey('Matemáticas')).toBe('math');
    expect(resolveSubjectKey('math')).toBe('math');
    expect(resolveSubjectKey('Otro')).toBe('other');
  });
});

describe('buildPedagogicalSystemPrompt', () => {
  it('requires semantic scope judgment and JSON decision output', () => {
    const prompt = buildPedagogicalSystemPrompt(baseCtx);

    expect(prompt).toContain('Active subject filter: Historia');
    expect(prompt).toContain('DIFFICULTY basic (mandatory)');
    expect(prompt).toContain('CONTROL PRIORITY');
    expect(prompt).toContain('OUTPUT CONTRACT');
    expect(prompt).toContain('refuse_off_subject');
    expect(prompt).toContain('do not rely on keyword matching');
  });

  it('uses teacher role guidance when userRole is teacher', () => {
    const prompt = buildPedagogicalSystemPrompt({
      ...baseCtx,
      userRole: 'teacher',
    });

    expect(prompt).toContain('Role scope (teacher)');
    expect(prompt).toContain('classroom use');
  });

  it('relaxes subject boundary for Other', () => {
    const prompt = buildPedagogicalSystemPrompt({
      ...baseCtx,
      subject: 'Otro',
    });

    expect(prompt).toContain('Subject scope: the active filter is "Other"');
    expect(prompt).not.toContain('Subject scope (hard boundary)');
  });
});

describe('parseTutorAgentDecision', () => {
  it('parses a valid decision payload', () => {
    const decision = parseTutorAgentDecision(
      JSON.stringify({
        action: 'refuse_off_subject',
        reply: 'Fuera del filtro de materia.',
      }),
    );

    expect(decision).toEqual({
      action: 'refuse_off_subject',
      reply: 'Fuera del filtro de materia.',
    });
  });

  it('parses JSON embedded in markdown fences', () => {
    const decision = parseTutorAgentDecision(
      '```json\n{"action":"answer","reply":"Hola"}\n```',
    );

    expect(decision?.action).toBe('answer');
    expect(decision?.reply).toBe('Hola');
  });
});

describe('assessTutorScope (fake-only helper)', () => {
  it('allows in-subject history questions', () => {
    const result = assessTutorScope({
      subject: 'Historia',
      userRole: 'student',
      message: '¿Qué fue la Revolución Francesa?',
    });

    expect(result.ok).toBe(true);
  });

  it('rejects clear off-subject math questions while history is active', () => {
    const result = assessTutorScope({
      subject: 'Historia',
      userRole: 'student',
      message: 'Resuélveme esta ecuación algebraica y la derivada',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe('off_subject');
      expect(result.reply).toContain('Matemáticas');
    }
  });

  it('rejects student homework-completion requests', () => {
    const result = assessTutorScope({
      subject: 'Lengua',
      userRole: 'student',
      message: 'Escríbeme el ensayo completo de literatura',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.kind).toBe('role_violation');
    }
  });
});
