export type ApiErrorKind = 'network' | 'not_found' | 'server' | 'invalid_response';

export class ApiError extends Error {
  readonly kind: ApiErrorKind;

  constructor(kind: ApiErrorKind, message?: string) {
    super(message ?? kind);
    this.name = 'ApiError';
    this.kind = kind;
  }
}

export const isAbortError = (error: unknown): boolean => {
  return error instanceof Error && error.name === 'AbortError';
};

export const createAbortError = (): Error => {
  const error = new Error('The operation was aborted');
  error.name = 'AbortError';
  return error;
};

export const toUserMessage = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.kind) {
      case 'network':
        return 'Impossible de joindre le serveur. Vérifiez votre connexion.';
      case 'not_found':
        return "Ce magasin n'existe pas ou a été supprimé.";
      case 'server':
        return 'Le serveur a rencontré un problème. Réessayez dans un instant.';
      case 'invalid_response':
        return 'Réponse inattendue du serveur.';
    }
  }
  return 'Une erreur inattendue est survenue.';
};
