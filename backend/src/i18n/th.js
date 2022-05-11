import frenchMessages from 'ra-language-french';

export default {
    simple: {
        action: {
            close: 'Fermer',
            resetViews: 'Réinitialiser des vues',
        },
        'create-post': 'Nouveau post',
    },
    ...frenchMessages,
    resources: {
        posts: {
            name: 'Article |||| Articles',
            fields: {
                average_note: 'Note moyenne ก',
                body: 'Contenu ก',
                comments: 'Commentaires ก',
                commentable: 'Commentable ก',
                commentable_short: 'Com ก.',
                created_at: 'Créé le ก',
                notifications: 'Destinataires de notifications ก',
                nb_view: 'Nb de vues ก',
                password: 'Mot de passe (si protégé) ก',
                pictures: 'Photos associées ก',
                published_at: 'Publié le ก',
                teaser: 'Description ก',
                tags: 'Catégories ก',
                title: 'Titre ก',
                views: 'Vues ก',
                authors: 'Auteurs ก',
            },
        },
        comments: {
            name: 'Commentaire |||| Commentaires',
            fields: {
                body: 'Contenu',
                created_at: 'Créé le',
                post_id: 'Article',
                author: {
                    name: 'Auteur',
                },
            },
        },
        users: {
            name: 'User |||| Users',
            fields: {
                name: 'Name',
                role: 'Role',
            },
        },
    },
    post: {
        list: {
            search: 'Recherche',
        },
        form: {
            summary: 'Résumé',
            body: 'Contenu',
            miscellaneous: 'Extra',
            comments: 'Commentaires',
        },
        edit: {
            title: 'Article "%{title}"',
        },
    },
    comment: {
        list: {
            about: 'Au sujet de',
        },
    },
    user: {
        list: {
            search: 'Recherche',
        },
        form: {
            summary: 'Résumé',
            security: 'Sécurité',
        },
        edit: {
            title: 'Utilisateur "%{title}"',
        },
    },
    // ra: {
    //     auth:{
    //         username: "User name",
    //         password: "Password",
    //         email: "Email",
    //         sign_in: "Sign in"
    //     }
    // }
};
