export default function About() {
  return (
    <main className="p-8 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-6 text-blue-400 font-bold drop-shadow-sm">
        About Exhibition Curator
      </h1>
      
      <div className="mb-8 p-6 bg-gray-800 border-2 border-gray-600 rounded-lg">
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Exhibition Curator is a simple app that allows users to search European historical related museum apis and create their own exhibits based on their own historical interests.
        </p>
        
        <h2 className="text-2xl font-bold text-blue-400 mb-4 border-b border-gray-600 pb-2">
          How it works
        </h2>
        
        <p className="text-gray-300 text-lg leading-relaxed mb-6">
          Ideally, users should be able to search for general queries using the Europeana API, while those looking for old manuscript or texts are better of using the Oxford Manuscript api, both selectable via the drop down menu from the explore pages.
        </p>
        
        <p className="text-gray-300 text-lg leading-relaxed">
          If you want to then save exhibits out of your own interest, then we advise creating an account. This helps you save your own custom exhibits and themes, allowing you to store the artefacts that come through. For example, you might find armour interesting, so create an account and then an exhibit called armour. From there, you can search for chainmail, robes, plate armour, bucklers, etc. Perhaps you want to find maps. Perhaps you&apos;re big on maps. Try mappa mundi, medieval maps, maps of the new world, etc. The choice is yours.
        </p>
      </div>
    </main>
  );
}