import { error } from "console";
import { Interface } from "readline";

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

export function oxfordDescriptionRegexCheck(description: string): string {
  if (description === undefined){
    return 'Description preview not provided by the collection'
  } else {
  const regex = /<em>(.*?)<\/em>/g
  const newDescription = description[0].replace(regex, '$1');
  return newDescription
  }
}

export function oxfordTitleRegexCheck(title: string): string {
  if (title === undefined){
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
      return "Try searching for the Vikings.";
    case "Battles":
      return "Explore historical battles.";
    case "Reconquista":
      return "Research the Reconquista.";
    case "Plantagenet":
      return "Learn about the Plantagenet dynasty.";
    case "30 Years War":
      return "Look into the Thirty Years War.";
    case "Crusades":
      return "Dive into the Crusades.";
    case "Reformation":
      return "Discover the Reformation.";
    case "Renaissance":
      return "Explore the Renaissance.";
    case "Black Death":
      return "Read about the Black Death.";
    case "Ottoman Empire":
      return "Search for the Ottoman Empire.";
    case "Carolingian":
      return "Study the Carolingian period.";
    case "Anglo Saxons":
      return "Learn about the Anglo-Saxons.";
    case "Holy Roman Empire":
      return "Explore the Holy Roman Empire.";
    case "Vatican":
      return "Look up the Vatican's history.";
    case "Hanseatic League":
      return "Research the Hanseatic League.";
    case "New World":
      return "Discover the New World.";
    case "Tudors":
      return "Learn about the Tudors.";
    case "100 Years War":
      return "Explore the 100 Years War.";
    case "Habsburg":
      return "Research the Habsburg dynasty.";
    default:
      return "";
  }

}

