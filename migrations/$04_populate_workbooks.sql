USE railway;

SET @word_id = (SELECT id
                FROM books
                WHERE title = 'Word');
SET @excel_id = (SELECT id
                 FROM books
                 WHERE title = 'Excel');

INSERT INTO workbooks (book_id, seq_order, title, description)
VALUES (@word_id, 1, 'Word – fonctions de base', 'Tout ce qui est créé dans un document Word est créé dans un paragraphe, d’où l’importance de bien en maîtriser sa mise en forme. J’encourage fortement les apprenants à découvrir la richesse de ce logiciel et d’en explorer ses outils. Quand on maîtrise la base d’un logiciel, tout le reste devient facile.'),
       (@word_id, 2, 'Word – fonctions intermédiaires', 'Les tableaux dans Word sont très faciles d’utilisation et ils sont bien appréciés de la part des utilisateurs. Dans ces notes, vous vous familiariserez avec la fusion et le publipostage, l’utilisation et la modification des styles, la mise en page, la numérotation des pages. Dorénavant, quelques clics vous suffiront pour générer une table des matières.'),
       (@word_id, 3, 'Word – fonctions avancées', 'Ces notes sont riches d’outils sophistiqués utilisés par les pros de Word. Créer vos propres modèles de documents vous sauvera beaucoup de travail. Dans ces notes vous apprendrez à nettoyer vos documents afin de les remettre à neuf. Vous apprendrez même à créer une macrocommande.'),
       (@excel_id, 1, 'Excel – fonctions de base', 'Ces notes regroupent tout ce qu’un utilisateur d’Excel doit savoir. De la manipulation d’un tableau aux calculs simples, de la mise en page à la protection des données, une fois ces éléments maîtrisés, vous serez fins prêts pour passer aux fonctions intermédiaires.'),
       (@excel_id, 2, 'Excel – fonctions intermédiaires', 'Ces notes vous amèneront à la découverte des innombrables fonctions prédéfinies d’Excel, aux mises en forme conditionnelles et même à la création d’un graphique à l’aide d’une simple touche du clavier. Vous serez emballé par les tableaux de données, les tris et les filtres, sans oublier la merveilleuse fonction Sous-total que peu de gens connaissent.'),
       (@excel_id, 3, 'Excel – fonctions avancées', 'Ces notes vous permettront de créer facilement des tableaux croisés dynamiques, vous vous amuserez aussi à explorer plusieurs nouvelles fonctions dynamiques. Vous serez en mesure de comparer deux listes, de consolider vos données, de créer des listes déroulantes et de personnaliser vos affichages. Vous apprendrez ici à créer une macrocommande et beaucoup plus.');
