import { RefObject } from "react";


export function formatSources(apiSource: string): string {
  switch (apiSource) {
    case 'europeana':
      return 'Europeana';
    case 'digital-bodleian-oxford':
      return 'Digital Bodleian - University of Oxford';
    case 'fitzwilliam':
      return 'Fitzwilliam Museum - University of Cambridge';
    case 'natmus':
      return 'National Museum of Denmark';
    case 'finna':
      return 'National Finnish Museum';
    case 'digitaltmuseum':
      return 'DigitaltMuseum';
    case 'soch':
      return 'Swedish Open Cultural Heritage';
    default:
      return apiSource.charAt(0).toUpperCase()
  }
}

export function oxfordDescriptionRegexCheck(description: string[]): string {
  if (description === undefined || description.length === 0){
    return 'Description preview not provided by the collection'
  } else {
    const regex = /<em>(.*?)<\/em>/g
    const newDescription = description[0].replace(regex, '$1');
    return newDescription
  }
}

export function oxfordTitleRegexCheck(title: string[]): string {
  if (title === undefined || title.length === 0){
    return 'Title preview not provided by the collection'
  } else {
    // console.log(title, "Inside the regex file for oxford title.")
    const regex = /<em>(.*?)<\/em>/g
    const newTitle = title[0].replace(regex, '$1');
    return newTitle
  }
}

export function searchForRNG() {
  const searchForIdeas = ["Vikings", "Battles", "Reconquista", "Plantagenet", "30 Years War", "Crusades", "Reformation", "Rennaissance", "Black Death", "Ottoman Empire", "Carolingian", "Anglo Saxons", "Holy Roman Empire", "Vatican", "Hansiatic League", "New World", "Tudors", "100 Years War", "Hasburg"]
  const pickLength = searchForIdeas.length
  const randomIndex = Math.floor(Math.random() * pickLength)
  const randomIdea = searchForIdeas[randomIndex];
switch (randomIdea) {
    case "Vikings":
      return "Vikings.";
    case "Battles":
      return "Battles.";
    case "Reconquista":
      return "Reconquista.";
    case "Plantagenet":
      return "Plantagenet dynasty.";
    case "30 Years War":
      return "Thirty Years War.";
    case "Crusades":
      return "Crusades.";
    case "Reformation":
      return "Reformation.";
    case "Renaissance":
      return "Renaissance.";
    case "Black Death":
      return "Black Death.";
    case "Ottoman Empire":
      return "Ottoman Empire.";
    case "Carolingian":
      return "Carolingian period.";
    case "Anglo Saxons":
      return "Anglo-Saxons.";
    case "Holy Roman Empire":
      return "Holy Roman Empire.";
    case "Vatican":
      return "Vatican";
    case "Hanseatic League":
      return "Hanseatic League.";
    case "New World":
      return "New World.";
    case "Tudors":
      return "Tudors.";
    case "100 Years War":
      return "100 Years War.";
    case "Habsburg":
      return "Habsburg dynasty.";
    case "Maps":
      return "Maps";
    case "Coins":
      return "Coins";  
    case "Pope":
      return "Pope";
    case "Medieval armour":
      return "Medieval armour";
    case "Rome":
      return "Rome";  
    default:
      return "";
  }
}