/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
/**
 * J'ai choisi d'utiliser TypeScript pour définir les types de mes requêtes Express car cela me permet d'avoir un contrôle de type statique et des fonctionnalités d'auto-complétion dans mon éditeur de code.
 * Ce fichier, 'Request.ts', est utilisé pour étendre l'interface de requête Express par défaut avec des informations supplémentaires sur l'utilisateur.
 * L'objet 'user' dans la requête contient des informations sur l'utilisateur qui a fait la requête, y compris son ID, son nom, son email, son statut d'administrateur et son token.
 */

declare namespace Express {
  export interface Request {
    user: {
      _id: string
      name: string
      email: string
      isAdmin: boolean
      token: string
    }
  }
}
