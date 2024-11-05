# Entrenament d’un LLM basat en informació de Zendesk

Per entrenar un model de llenguatge gran (LLM) basat en la informació de Zendesk que conté preguntes i respostes del servei d’atenció al client per a l’Autoritat Metropolitana de Barcelona, i que inclou categories, articles i altres situacions de transport públic, seguirem un enfocament estructurat que garanteixi que el model capturi i processi aquesta informació de manera efectiva.

## 1. Recuperació i Preparació de Dades
   - **Integració de l'API de Zendesk**:
     - Utilitzarem l’API de Zendesk per recuperar dades de la secció de preguntes i respostes (Q&A), categories i articles. Això inclou informació relacionada amb la venda de bitllets i diferents escenaris de transport (autobusos, tramvies, metro, trens, etc.).
     - Autenticar-se utilitzant les credencials de Zendesk i configurar els endpoints de l'API per extreure:
       - **Articles** (per obtenir informació detallada sobre bitllets, polítiques de transport i interrupcions del servei)
       - **Categories** (per estructurar les dades en seccions com problemes de bitllets, informació de rutes, serveis especials, etc.)
       - **Incidències** (per obtenir dades de preguntes i respostes entre els agents de servei al client i els clients)

   - **Neteja i Anonimització de Dades**:
     - Netejar les dades per eliminar informació irrellevant i garantir la privacitat dels clients anonimitzant qualsevol informació personal o sensible.
     - Normalitzar les dades de text (per exemple, eliminar etiquetes HTML innecessàries, corregir problemes de codificació i unificar formats).

## 2. Estructuració i Etiquetatge de Dades
   - **Organitzar les Dades en Seccions Contextuals**:
     - Agrupar les preguntes i respostes per temes (per exemple, problemes de bitllets, objectes perduts, informació de rutes) per facilitar-ne la comprensió i estructuració.
     - Estructurar articles i categories com a seccions de referència, perquè el model LLM pugui accedir a contingut detallat quan generi respostes.
   - **Etiquetar la Informació**:
     - Etiquetar diferents seccions de dades amb etiquetes rellevants (per exemple, "venda de bitllets", "interrupció del servei", "informació de rutes", "política de reemborsaments") per ajudar el model LLM a entendre i categoritzar la informació.

## 3. Ajust Fi del Model
   - **Preentrenament amb un Dataset General**:
     - Utilitzar un model preentrenat que tingui un coneixement general de la llengua catalana i dels conceptes de transport.
   - **Ajust Fi amb Dades de Zendesk**:
     - Ajustar el model LLM utilitzant les dades estructurades de Zendesk per fer-lo específic al context de l’Autoritat Metropolitana:
       - **Dades de Preguntes i Respostes**: Ajustar el model per millorar l’exactitud de les seves respostes basant-se en les interaccions reals amb els clients i les preguntes més freqüents.
       - **Dades dels Articles**: Entrenar el model perquè pugui referenciar i proporcionar informació detallada basada en els articles (per exemple, explicant opcions de bitllets o normes específiques de transport).
       - **Contextos de les Categories**: Assegurar-se que el model entén el context de cada categoria i pot navegar-hi o referenciar-les adequadament.

## 4. Optimització i Proves del Model
   - **Proves del Model amb Dades Històriques**:
     - Provar el model ajustat amb preguntes històriques del servei d’atenció al client per avaluar-ne el rendiment. Comprovar si el model pot proporcionar respostes precises i rellevants basant-se en casos anteriors.
   - **Bucle de Retroalimentació i Iteració**:
     - Implementar un bucle de retroalimentació on es valorin les respostes i es corregeixin discrepàncies per a seguir refinant el model.
     - Utilitzar tècniques com l’aprenentatge actiu, on les preguntes noves o poc comunes són revisades manualment i afegides al dataset per a futurs entrenaments.

## 5. Desplegament i Millora Contínua
   - **Desplegament en Localhost (Fase Inicial)**:
     - Desplegar inicialment el model LLM en localhost per fer proves i iteracions. Això permet un entorn segur i controlat per avaluar les respostes del model.
   - **Monitorització i Actualitzacions**:
     - Monitoritzar contínuament el rendiment del model. Utilitzar registres i mètriques (per exemple, precisió de les respostes, valoracions de satisfacció dels usuaris) per identificar àrees de millora.
   - **Escalat i Integració en el Núvol (Azure)**:
     - Un cop provat localment i optimitzat, desplegar la solució en Azure. Assegurar-se que té alta disponibilitat i integració amb la infraestructura existent de l’Autoritat Metropolitana.
     - Actualitzar contínuament el model amb noves dades de Zendesk per mantenir-lo rellevant amb les últimes interaccions amb els clients i novetats del transport.
