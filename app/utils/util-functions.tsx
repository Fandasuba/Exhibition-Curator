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