# SDG Ontology.

The SDG_Ontology.owl file represents the ontology visualised. During this development the main development of the ontology is done localy, where the updated ontology is sent to GraphDB. There is posibilites to alter the ontology directly in GraphDB, and furthermore create a end-point allowing to add instances along with connecting them to establised predicates. However, this is defined as further work in our bachelor project.
## The sustainability ontology.
The developed ontology currently portrays a limited but complex systemising of sustainable development. The development of this ontology has mainly focused on expressing connections between known concepts such as the sustainability goals in the RDF language. The ontology and its assosiated technology stack is meant to visualise the possibilites arising with the use of ontologies.
## Essential sources.
The SDG_Ontology.owl file contains all sources used to define and establish classes, instances and object properties. Within the ontology, the sources are connected to the main class within the hierarchy or as Annontations for the specified concept. However, three essential sources needs to be highlighted in accordance with the complexity of the ontology.
### Statistiske sentralbyrås taxonomy for classification of indicator for the sustainability goals.
This taxonomy has been used as the core for the developed ontology. Without this resource the structural expansion of the ontology would be severly reduced.

 "Taksonomi for klassifisering av indikatorer til bærekraftsmålene" (Norwegian). Written by: Li-Chun Zhang, Johan Fosen, Bjørn Are Holth and Tatsiana Pekarskaya. Publised 09.02.2021. Publisher: Statistisk sentralbyrå. ISBN:978-82-587-1281-4
 ### Mapping the Sustainable Development Goals Relationships.
 This sientific article has been used to defined object properties such as: "harHøyKorrelasjon" and "harHøyTradeOff" based on their work in descovering interactions between sustabiability goals.
 
 "Mapping the Sustainable Development Goals Relationships" Written by: Luis Miguel Fonseca, José Pedro Domingues og Alina Mihaela Dima. Publisher: MDPI. Publised: 20.04.2020
  ###  An Ontology-Based Knowledge Modelling for a Sustainability Assessment Domain.
  This ontology is present in our developed ontology, however not connected. A similar class hierarchy expressed in `Approaches` within this ontology, has been used to express `Metoder` in our current developed ontology. Furthermore, this ontology has provided a better insight during the structural expansion of our ontology.
  
  "An Ontology-Based Knowledge Modelling for a Sustainability Assessment Domain" Written by: Agnieszka Konys. Journal: Sustainability 10(2). Publised: January 2018 DOI:10.3390/su10020300
## Furter work.
Further development on the ontology will be possible for only a set amount of superusers. This would be implementing new classes, object properties, data properties, annotations.  Only within certain subclasses, will there be possiblites for autorised users to implement induviduals. Furthermore, implemented object properties, data properties and annotations can be exploted during implementation of new induviduals to reuse the dynamic relations within the ontology.
