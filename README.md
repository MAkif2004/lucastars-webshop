# Opdracht blok 4 HBO-ICT SE

## Hoe is deze repository ingericht
- Story-board. Via het menu links (Plan > Issues) vind je alle user stories.
- Broncode in de map `src` (Repository) voor een client- en server applicatie.
- Documentatie in de map `docs` (Repository). Hier houden jullie gezamenlijk documentatie bij voor dit project.

## Project voor de eerste keer opstarten
1. Installeer Visual Studio Code, deze kun je downloaden via https://code.visualstudio.com/.

2. Installeer de volgende plugins voor Visual Studio Code. Dit kan via de browser, of vanuit Visual Studio Code zelf in de `Extensions` sectie van de linker menubalk:
    - ESLint: https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint
    - EditorConfig: https://marketplace.visualstudio.com/items?itemName=editorconfig.editorconfig
    - lit-plugin: https://marketplace.visualstudio.com/items?itemName=runem.lit-plugin

3. Installeer NodeJS, deze kun je voor jouw systeem downloaden via https://nodejs.org/en/download/prebuilt-installer. 
   - **Let op!** Installeer versie `20.x.x`!

4. Installeer Git, voor uitleg zie de [HBO-ICT Knowledgebase](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/manage_and_control/git/installeren/git_installeren/#git-installeren).

5. Configureer Git, voor uitleg zie de [HBO-ICT Knowledgebase](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/manage_and_control/git/installeren/git_installeren/#git-configureren).

6. Maak een SSH key aan en koppel deze aan GitLab, voor uitleg zie de [HBO-ICT Knowledgebase](https://knowledgebase.hbo-ict-hva.nl/1_beroepstaken/software/manage_and_control/git/installeren/git_installeren/#git-koppelen-aan-gitlab).

7. Clone dit project met Git naar je computer, dit kan je via de terminal doen met een `git clone` commando, vanuit Visual Studio Code zelf of met een visueel programma als Fork (https://git-fork.com/).

8. Open na het clonen de map in Visual Studio Code met `File > Open Folder...`.

9. Ga in de menubalk naar `View > Open View...` en zoek naar "NPM". Als je nu in de `Explorer` sectie van de linker menubalk op de `package.json` klikt, krijg je een extra paneel erbij met de naam "NPM Scripts". 

10. In het "NPM Scripts"-paneel, klik met rechts op `package.json` en klik op `Run Install`, of voer handmatig `npm install` in een terminal uit.

11. In [database.sql](database.sql) staat een sql script om een database aan te maken met een session tabel.

12. In [.env](src/api/.env) dien je de database connectie te configuren.

13. Start de server applicatie. Klik nu op de pijl achter `dev` onder `src\api\package.json`, of voer handmatig `npm run dev` vanuit de juiste map in een termimal uit.
    - Via de build tool [esbuild](https://esbuild.github.io/) wordt er een lokale server opgestart. Als je de URL uit de terminal (als het goed is: http://127.0.0.1:3001) in de browser opent, zie je de tekst "Welcome to the API!". Wijzigingen die je maakt in de code worden nu realtime (direct) herladen!

14. Start de client applicatie. Klik nu op de pijl achter `dev` onder `src\web\package.json`, of voer handmatig `npm run dev` vanuit de juiste map in een termimal uit.
    - Via de build tool [Vite](https://vitejs.dev/) wordt er een lokale server opgestart. Als je de URL uit de terminal (als het goed is: http://127.0.0.1:3000) in de browser opent, zie je welcomePagina.

15. Om de homepagina staan een aantal knopppen waarmee je een sessie kan maken, een sessie kan verwijderen en een tekst kan ophalen waarvoor je een sessie moet hebben. Dit dient als voorbeeld.

## Projectbeschrijving en studiemateriaal

Alle benodigde informatie is te vinden op de [HBO-ICT Knowledgebase](https://knowledgebase.hbo-ict-hva.nl/3_onderwijs/se/opdracht4/).

## Studiehandleiding

In de Studiehandleiding op de DLO staat beschreven welke competenties je gaat ontwikkelen en wat de leeruitkomsten zijn voor dit blok.
