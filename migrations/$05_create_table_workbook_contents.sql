USE railway;
# get the ids for all the workbooks
SET @word_base_id = (SELECT id
                     FROM workbooks
                     WHERE title = 'Word – fonctions de base');
SET @word_inter_id = (SELECT id
                      FROM workbooks
                      WHERE title = 'Word – fonctions intermédiaires');
SET @word_adv_id = (SELECT id
                    FROM workbooks
                    WHERE title = 'Word – fonctions avancées');

SET @excel_base_id = (SELECT id
                      FROM workbooks
                      WHERE title = 'Excel – fonctions de base');
SET @excel_inter_id = (SELECT id
                       FROM workbooks
                       WHERE title = 'Excel – fonctions intermédiaires');
SET @excel_adv_id = (SELECT id
                     FROM workbooks
                     WHERE title = 'Excel – fonctions avancées');
# create the workbook_contents table
CREATE TABLE workbook_contents
(
    id          INT AUTO_INCREMENT PRIMARY KEY COMMENT 'primary key',
    workbook_id INT        NOT NULL COMMENT 'foreign key to workbook',
    content     TEXT       NOT NULL COMMENT 'web page content description of the book',
    path        VARCHAR(8) NOT NULL COMMENT 'the hierarchy of sections and subsections',
    level       INT        NOT NULL COMMENT 'the level of the section or subsection',
    FOREIGN KEY (workbook_id) REFERENCES workbooks (id)
);

# populate the workbook_contents table
INSERT INTO workbook_contents(workbook_id, content, path, level)
VALUES (@word_base_id, 'Le contrôle de l’environnement de travail', '1', 1),
       (@word_base_id, 'Le ruban et les barres d’outils', '2', 1),
       (@word_base_id, 'Les modes d’affichage', '3', 1),
       (@word_base_id, 'Les différents pointeurs', '4', 1),
       (@word_base_id, 'La création et la sauvegarde d’un document', '5', 1),
       (@word_base_id, 'La saisie du texte', '5.1', 2),
       (@word_base_id, 'La sélection du texte', '5.2', 2),
       (@word_base_id, 'La modification et la correction du texte', '5.3', 2),
       (@word_base_id, 'Le couper / copier / coller', '6', 1),
       (@word_base_id, 'La mise en forme des caractères', '7', 1),
       (@word_base_id, 'La mise en forme des paragraphes', '8', 1),
       (@word_base_id, 'La mise en page d’un document', '9', 1),
       (@word_base_id, 'L’impression', '10', 1),
       (@word_base_id, 'L’envoi d’un document', '11', 1),
       (@word_base_id, 'Les fonctions auxiliaires', '12', 1);

INSERT INTO workbook_contents(workbook_id, content, path, level)
VALUES (@word_inter_id, 'Les tableaux', '1', 1),
       (@word_inter_id, 'La structure d’un tableau', '1.1', 2),
       (@word_inter_id, 'Les styles prédéfinis', '1.2', 2),
       (@word_inter_id, 'Le tri des données', '1.3', 2),
       (@word_inter_id, 'La copie d’un tableau Excel dans un document Word', '1.4', 2),
       (@word_inter_id, 'L’insertion d’une feuille Excel', '1.5', 2),
       (@word_inter_id, 'La fusion et le publipostage', '2', 1),
       (@word_inter_id, 'Les listes de données pour publipostage', '2.1', 2),
       (@word_inter_id, 'L’insertion des champs de fusion', '2.2', 2),
       (@word_inter_id, 'Le bloc d’adresses', '2.3', 2),
       (@word_inter_id, 'Les styles', '3', 1),
       (@word_inter_id, 'Application et modification d’un style', '3.1', 2),
       (@word_inter_id, 'La création d’un style', '3.2', 2),
       (@word_inter_id, 'La numérotation des titres', '3.3', 2),
       (@word_inter_id, 'Les jeux de styles', '3.4', 2),
       (@word_inter_id, 'Le mode plan', '4', 1),
       (@word_inter_id, 'Les sauts de section', '5', 1),
       (@word_inter_id, 'La table des matières', '6', 1),
       (@word_inter_id, 'La page de garde', '7', 1),
       (@word_inter_id, 'Les en-têtes et le pieds de page simples et élaborés', '8', 1),
       (@word_inter_id, 'Les bordures de page', '9', 1);

INSERT INTO workbook_contents(workbook_id, content, path, level)
VALUES (@word_adv_id, 'Les signets, les notes de bas de page, les renvois, les hyperliens', '1', 1),
       (@word_adv_id, 'Les légendes, la table des illustrations', '2', 1),
       (@word_adv_id, 'La création d’un index', '3', 1),
       (@word_adv_id, 'Les colonnes journalistiques', '4', 1),
       (@word_adv_id, 'Le nettoyage d’un document', '5', 1),
       (@word_adv_id, 'Les macrocommandes', '6', 1),
       (@word_adv_id, 'La révision de documents et le suivi des modifications', '7', 1),
       (@word_adv_id, 'La comparaison de documents', '8', 1),
       (@word_adv_id, 'Les modèles de document, les formulaires', '9', 1),
       (@word_adv_id, 'Les différents champs de texte', '9.1', 2),
       (@word_adv_id, 'Les contrôles de contenu', '9.2', 2),
       (@word_adv_id, 'La protection d’un formulaire', '9.3', 2),
       (@word_adv_id, 'Les illustrations', '10', 1),
       (@word_adv_id, 'Les images, les formes dessinées', '10.1', 2),
       (@word_adv_id, 'La capture d’écran', '10.2', 2),
       (@word_adv_id, 'Les SmartArt', '10.3', 2),
       (@word_adv_id, 'La coupure de mots', '11', 1),
       (@word_adv_id, 'Les dictionnaires', '12', 1),
       (@word_adv_id, 'Les citations', '13', 1),
       (@word_adv_id, 'La ligne de signature', '14', 1),
       (@word_adv_id, 'L’insertion d’une vidéo', '15', 1),
       (@word_adv_id, 'La conversion d’un fichier PDF en document Word', '16', 1),
       (@word_adv_id, 'Le partage d’un document', '17', 1);

INSERT INTO workbook_contents(workbook_id, content, path, level)
VALUES (@excel_base_id, 'Le contrôle de l’environnement de travail', '1', 1),
       (@excel_base_id, 'La barre d’État', '1.1', 2),
       (@excel_base_id, 'Le ruban et les barres d’outils', '1.2', 2),
       (@excel_base_id, 'Les classeurs récents', '1.3', 2),
       (@excel_base_id, 'Les différents pointeurs', '1.4', 2),
       (@excel_base_id, 'Création d’un tableau Excel', '2', 1),
       (@excel_base_id, 'La saisie et la modification des données', '2.1', 2),
       (@excel_base_id, 'Le couper / Copier / Coller', '3', 1),
       (@excel_base_id, 'Le collage spécial', '4', 1),
       (@excel_base_id, 'La transposition des données', '5', 1),
       (@excel_base_id, 'Les colonnes / les lignes / les cellules', '6', 1),
       (@excel_base_id, 'La recopie des données', '7', 1),
       (@excel_base_id, 'Les calculs simples', '8', 1),
       (@excel_base_id, 'Les références relatives et absolues', '9', 1),
       (@excel_base_id, 'L’analyse rapide', '10', 1),
       (@excel_base_id, 'Les formats numériques', '11', 1),
       (@excel_base_id, 'La mise en forme des données et des cellules', '12', 1),
       (@excel_base_id, 'Le contrôle de l’affichage', '13', 1),
       (@excel_base_id, 'Le Figer les volets', '13.1', 2),
       (@excel_base_id, 'Le fractionnement de la fenêtre', '14', 1),
       (@excel_base_id, 'La gestion des feuilles', '15', 1),
       (@excel_base_id, 'La mise en page', '16', 1),
       (@excel_base_id, 'L’impression', '17', 1),
       (@excel_base_id, 'La préparation du fichier pour sa diffusion', '18', 1),
       (@excel_base_id, 'La protection d’un classeur / des feuilles d’un classeur', '19', 1),
       (@excel_base_id, 'Les illustrations', '20', 1);

INSERT INTO workbook_contents(workbook_id, content, path, level)
VALUES (@excel_inter_id, 'Les fonctions prédéfinies', '1', 1),
       (@excel_inter_id, 'Les fonctions statistiques', '2', 1),
       (@excel_inter_id, 'Les fonctions mathématiques', '3', 1),
       (@excel_inter_id, 'Les fonctions dates et heures', '4', 1),
       (@excel_inter_id, 'Les fonctions logiques', '5', 1),
       (@excel_inter_id, 'Les fonctions de recherche', '6', 1),
       (@excel_inter_id, 'Les fonctions de texte', '7', 1),
       (@excel_inter_id, 'Les fonctions financières', '8', 1),
       (@excel_inter_id, 'Les formules tridimensionnelles', '9', 1),
       (@excel_inter_id, 'Les noms définis', '10', 1),
       (@excel_inter_id, 'La conversion de données', '11', 1),
       (@excel_inter_id, 'La mise en forme conditionnelle', '12', 1),
       (@excel_inter_id, 'Les graphiques', '13', 1),
       (@excel_inter_id, 'Les nouveaux graphiques', '14', 1),
       (@excel_inter_id, 'La gestion de listes de données', '15', 1),
       (@excel_inter_id, 'Les tableaux de données', '16', 1),
       (@excel_inter_id, 'L’importation de données', '17', 1),
       (@excel_inter_id, 'Les doublons', '18', 1),
       (@excel_inter_id, 'Les segments', '19', 1),
       (@excel_inter_id, 'Les fonctions statistiques de bases de données', '20', 1),
       (@excel_inter_id, 'Le tri', '21', 1),
       (@excel_inter_id, 'Les filtres automatiques', '22', 1),
       (@excel_inter_id, 'Les sous-totaux', '23', 1);

INSERT INTO workbook_contents(workbook_id, content, path, level)
VALUES (@excel_adv_id, 'Les tableaux croisés dynamiques', '1', 1),
       (@excel_adv_id, 'Les graphiques croisés dynamiques', '2', 1),
       (@excel_adv_id, 'Les segments', '3', 1),
       (@excel_adv_id, 'Les formules dynamiques', '4', 1),
       (@excel_adv_id, 'Les fonctions mathématiques', '5', 1),
       (@excel_adv_id, 'Les tables de données', '6', 1),
       (@excel_adv_id, 'Les fonctions IndexEquiv', '7', 1),
       (@excel_adv_id, 'La comparaison entre deux listes', '8', 1),
       (@excel_adv_id, 'La recherche de la valeur la plus proche', '9', 1),
       (@excel_adv_id, 'La fonction Fréquence', '10', 1),
       (@excel_adv_id, 'La fonction Indirect', '11', 1),
       (@excel_adv_id, 'La consolidation des données', '12', 1),
       (@excel_adv_id, 'Les scénarios', '13', 1),
       (@excel_adv_id, 'Le solveur', '14', 1),
       (@excel_adv_id, 'Les macrocommandes', '15', 1),
       (@excel_adv_id, 'Les listes déroulantes', '16', 1),
       (@excel_adv_id, 'La validation des données', '17', 1),
       (@excel_adv_id, 'Les hyperliens', '18', 1),
       (@excel_adv_id, 'L’audit des formules', '19', 1),
       (@excel_adv_id, 'Les affichages personnalisés', '20', 1),
       (@excel_adv_id, 'Les modèles de classeur', '21', 1),
       (@excel_adv_id, 'Le partage d’un classeur', '22', 1);