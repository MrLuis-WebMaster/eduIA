import type { UserPreferences } from '../../domain';
import type { PreferencesRepository } from '../../adapters/ports';

export function createLoadPreferences(deps: {
  preferencesRepository: PreferencesRepository;
}) {
  return async function loadPreferences(): Promise<UserPreferences> {
    return deps.preferencesRepository.loadAll();
  };
}
