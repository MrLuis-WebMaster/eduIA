import type { UserPreferences } from '../../domain';
import type { PreferencesRepository } from '../ports';
import { defaultUserPreferences } from '../defaults';

export function createResetPreferences(deps: {
  preferencesRepository: PreferencesRepository;
}) {
  return async function resetPreferences(): Promise<UserPreferences> {
    await deps.preferencesRepository.clear();
    return { ...defaultUserPreferences };
  };
}
