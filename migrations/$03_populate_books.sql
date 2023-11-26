USE railway;

SET @word_description =
        'Le logiciel Microsoft Word est un traitement de texte qui permet de créer des documents divers, de la simple lettre au document de plusieurs centaines de pages.\\nÀ l’aide de ce manuel, vous apprendrez à insérer un tableau, à utiliser les taquets de tabulation, à appliquer et modifier les styles, à générer une table des matières, à insérer des en-têtes et pied de book simples ou élaborés.\\nVous maîtriserez les sauts de sections, la fusion et le publipostage, le suivi des modifications, la manipulation des images, des graphiques SmartArt et l’ajout d’une book de garde. La mise en book de vos documents sera aussi grandement facilitée.\\nDoté d’une table des matières, d’un index et d’une liste des raccourcis clavier, le manuel Word 365 est un outil indispensable pour produire des documents de qualité professionnelle.';
SET @excel_description =
        'Le logiciel Microsoft Excel est un traitement de texte qui permet de créer des documents divers, de la simple lettre au document de plusieurs centaines de pages.\\nÀ l’aide de ce manuel, vous apprendrez à insérer un tableau, à utiliser les taquets de tabulation, à appliquer et modifier les styles, à générer une table des matières, à insérer des en-têtes et pied de book simples ou élaborés.\\nVous maîtriserez les sauts de sections, la fusion et le publipostage, le suivi des modifications, la manipulation des images, des graphiques SmartArt et l’ajout d’une book de garde. La mise en book de vos documents sera aussi grandement facilitée.\\nDoté d’une table des matières, d’un index et d’une liste des raccourcis clavier, le manuel Word 365 est un outil indispensable pour produire des documents de qualité professionnelle.';
SET @power_description =
        'Le logiciel Microsoft PowerPoint est un traitement de texte qui permet de créer des documents divers, de la simple lettre au document de plusieurs centaines de pages.\\nÀ l’aide de ce manuel, vous apprendrez à insérer un tableau, à utiliser les taquets de tabulation, à appliquer et modifier les styles, à générer une table des matières, à insérer des en-têtes et pied de book simples ou élaborés.\\nVous maîtriserez les sauts de sections, la fusion et le publipostage, le suivi des modifications, la manipulation des images, des graphiques SmartArt et l’ajout d’une book de garde. La mise en book de vos documents sera aussi grandement facilitée.\\nDoté d’une table des matières, d’un index et d’une liste des raccourcis clavier, le manuel Word 365 est un outil indispensable pour produire des documents de qualité professionnelle.';
SET @outlook_description =
        'Le logiciel Microsoft Outlook est un traitement de texte qui permet de créer des documents divers, de la simple lettre au document de plusieurs centaines de pages.\\nÀ l’aide de ce manuel, vous apprendrez à insérer un tableau, à utiliser les taquets de tabulation, à appliquer et modifier les styles, à générer une table des matières, à insérer des en-têtes et pied de book simples ou élaborés.\\nVous maîtriserez les sauts de sections, la fusion et le publipostage, le suivi des modifications, la manipulation des images, des graphiques SmartArt et l’ajout d’une book de garde. La mise en book de vos documents sera aussi grandement facilitée.\\nDoté d’une table des matières, d’un index et d’une liste des raccourcis clavier, le manuel Word 365 est un outil indispensable pour produire des documents de qualité professionnelle.';
SET @word_workbook_desc =
        'Les manuels par niveaux ne sont disponibles que pour les institutions d’enseignement et ne peuvent pas être commandés à partir de ce site. Pour plus d’informations, veuillez communiquer avec moi.\\nLes manuels par niveaux sont offerts pour les logiciels Word et Excel. Un cahier d’exercices se trouve à la fin de chacun de ces manuels. La quantité minimale d’une commande de manuels par niveaux est de 10 copies. Une commande doit aussi être faite pour un nombre pair de copies.';
SET @excel_workbook_desc =
        'Les manuels par niveaux ne sont disponibles que pour les institutions d’enseignement et ne peuvent pas être commandés à partir de ce site. Pour plus d’informations, veuillez communiquer avec moi.\\nLes manuels par niveaux sont offerts pour les logiciels Word et Excel. Un cahier d’exercices se trouve à la fin de chacun de ces manuels. La quantité minimale d’une commande de manuels par niveaux est de 10 copies. Une commande doit aussi être faite pour un nombre pair de copies.';

INSERT INTO books (title, background, border, image, description, workbook_desc)
VALUES ('Word', 'word-background', 'word-cover', 'word_cover.svg',
        @word_description, @word_workbook_desc),
       ('Excel', 'excel-background', 'excel-cover', 'excel_cover.svg',
        @excel_description, @excel_workbook_desc),
       ('PowerPoint', 'powerpoint-background', 'powerpoint-cover', 'powerpoint_cover.svg',
        @power_description, NULL),
       ('Outlook', 'outlook-background', 'outlook-cover', 'outlook_cover.svg',
        @outlook_description, NULL);