# SDG Ontology

The SDG_Ontology.owl file represents the ontology visualised. During this development the main development of the ontology is done localy, where the updated ontology is sent to GraphDB. There is posibilites to alter the ontology directly in GraphDB, and furthermore create a end-point allowing to add instances along with connecting them to establised predicates. However, this is defined as further work in our bachelor project.

## Essential sources
The SDG_Ontology.owl file contains all sources used to define and establish classes, instances and object properties. Within the ontology, the sources are connected to the main class within the hierarchy or as Annontations for the specified concept. However, three essential sources needs to be highlighted in accordance with the complexity of the ontology.
### Statistiske sentralbyrås taxonomy for classification of indicator for the sustainability goals.
This taxonomy has been used as the core for the developed ontology. Without this resource the structural expansion of the ontology would be severly reduced.

 "Taksonomi for klassifisering av indikatorer til bærekraftsmålene" (Norwegian). Written by: Li-Chun Zhang, Johan Fosen, Bjørn Are Holth and Tatsiana Pekarskaya. Publised 09.02.2021. Publisher: Statistisk sentralbyrå. ISBN:978-82-587-1281-4
## Furter work
Further development on the ontology will be possible for only a set amount of superusers. This would be implementing new classes, object properties, data properties, annotations, along with limitations conserning implementing induviduals.  Only within certain subclasses of the class `Approaches`, will there be possiblites to implement induviduals.  For an inital prototype, the subclass of `Approaches`: `Luftkvalitet` will be avaliable for a frontend user to insert new induviduals. Furthermore, implemented object properties, data properties and annotations can be exploted during implementation of new induviduals to reuse the dynamic relations within the ontology.
