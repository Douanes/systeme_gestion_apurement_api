# Notifications de Déploiement

Ce document explique comment configurer les notifications par email pour le workflow de déploiement.

## Fonctionnalités

Le workflow de déploiement envoie automatiquement des emails dans deux cas :

### 1. Déploiement Réussi ✅
- **Destinataires** : Développeurs Frontend ET Développeurs Backend (plusieurs emails possibles)
- **Contenu** :
  - Branche déployée
  - Message du commit
  - Auteur du commit
  - Date du commit
  - SHA court du commit
  - Tag de l'image Docker
  - URL de l'API
  - Lien vers les logs de déploiement

### 2. Déploiement Échoué ❌
- **Destinataires** : Développeurs Backend uniquement (plusieurs emails possibles)
- **Contenu** :
  - Branche concernée
  - Message du commit
  - Auteur du commit
  - Date du commit
  - SHA court du commit
  - Notification de rollback automatique
  - Lien vers les logs d'erreur

## Configuration des Secrets GitHub

Pour activer les notifications, vous devez configurer les secrets suivants dans votre dépôt GitHub :

### Secrets Existants (déjà configurés)
- `SMTP_HOST` - Serveur SMTP (ex: send.one.com)
- `SMTP_PORT` - Port SMTP (ex: 465)
- `SMTP_SECURE` - Utiliser SSL/TLS (ex: true)
- `SMTP_USER` - Utilisateur SMTP 
- `SMTP_PASS` - Mot de passe SMTP
- `SMTP_FROM` - Adresse d'expéditeur 

### Nouveaux Secrets à Ajouter

- `DEV_FRONTEND_EMAILS` - Emails des développeurs frontend (séparés par des virgules)
- `DEV_BACKEND_EMAILS` - Emails des développeurs backend (séparés par des virgules)

## Comment Ajouter les Secrets

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** (Paramètres)
3. Dans le menu de gauche, cliquez sur **Secrets and variables** → **Actions**
4. Cliquez sur **New repository secret**
5. Ajoutez les secrets suivants :

   **DEV_FRONTEND_EMAILS**
   ```
   Name: DEV_FRONTEND_EMAILS
   Value: dev1@example.com,dev2@example.com,dev3@example.com
   ```

   *Note: Vous pouvez mettre un seul email ou plusieurs séparés par des virgules (sans espaces)*

   **DEV_BACKEND_EMAILS**
   ```
   Name: DEV_BACKEND_EMAILS
   Value: backend-dev1@example.com,backend-dev2@example.com
   ```

   *Note: Vous pouvez mettre un seul email ou plusieurs séparés par des virgules (sans espaces)*

## Exemple d'Email de Succès

```
✅ Déploiement Réussi
Apurement API - Production

Le déploiement de l'API Apurement a été effectué avec succès.

🔖 Branche: main
📝 Commit: feat: Add email notifications for deployment workflow
👤 Auteur: baba
📅 Date: 2025-12-27 11:05:59 +0000
🔑 SHA Court: c60968d
🐳 Image Docker: babaly/apurement-api:main-c60968d
🌐 URL API: https://api-apurement.ameenaltech.com

[Voir les logs de déploiement]
```

## Exemple d'Email d'Échec

```
❌ Échec du Déploiement
Apurement API - Production

⚠️ Attention : Le déploiement a échoué et le système a effectué un rollback
automatique vers la version précédente.

🔖 Branche: main
📝 Commit: fix: Update configuration
👤 Auteur: baba
📅 Date: 2025-12-27 11:05:59 +0000
🔑 SHA Court: c60968d

Action requise : Veuillez consulter les logs pour identifier et corriger le problème.

[Consulter les logs d'erreur]
```

## Désactiver les Notifications

Pour désactiver les notifications, vous pouvez :

1. **Temporairement** : Commenter les jobs `notify-success` et `notify-failure` dans `.github/workflows/deploy.yml`
2. **Définitivement** : Supprimer les jobs `notify-success` et `notify-failure` du workflow

## Dépannage

### Les emails ne sont pas envoyés

1. Vérifiez que tous les secrets SMTP sont correctement configurés
2. Vérifiez que `DEV_FRONTEND_EMAIL` et `DEV_BACKEND_EMAIL` sont définis
3. Consultez les logs du workflow dans l'onglet Actions de GitHub
4. Vérifiez que l'action `dawidd6/action-send-mail@v3` n'a pas échoué

### Les emails arrivent en spam

1. Configurez un SPF record pour votre domaine
2. Configurez un DKIM record pour votre domaine
3. Utilisez une adresse d'expéditeur avec un domaine vérifié
4. Demandez aux destinataires de marquer les emails comme "Non spam"

### Format des emails incorrect

Les emails utilisent du HTML. Si le client email ne supporte pas HTML, une version texte brute sera affichée. La plupart des clients modernes supportent HTML.

## Support

Pour toute question ou problème concernant les notifications de déploiement, contactez l'équipe DevOps.
