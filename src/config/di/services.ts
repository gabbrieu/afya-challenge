import { JwtTokenService } from '#services/auth/jwt-token.service';
import type { DependencyContainer } from 'tsyringe';

export function setupServicesContainers(container: DependencyContainer): void {
  container.register('JWTService', { useClass: JwtTokenService });
}
