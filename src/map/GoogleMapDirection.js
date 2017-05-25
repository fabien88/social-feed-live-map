import React from 'react';

import { withGoogleMap, GoogleMap, Marker, InfoWindow, DirectionsRenderer } from 'react-google-maps';
import MapMarker from './MapMarker';

const CDN = 'https://d1vfuujltsw10o.cloudfront.net';

const allSteps = [
  {
    step: 'ETAPE 1',
    date: '1 May 2017',
    city: 'CUERS',
    place: 'Centre de secours principal',
    address: 'Chemin du Pouverel, 83390 Cuers',
    coord: '43.236412,6.0147123',
  },
  {
    step: 'ETAPE 2',
    date: '2 May 2017',
    city: 'BRIGNOLES',
    place: 'Caserne des sapeurs pompiers',
    address: 'AVENUE ADJUDANT CHEF MARIE LOUIS BROQUIER, 83170 Brignoles',
    coord: '43.4074959,6.0387073',
  },
  {
    step: 'ETAPE 3',
    date: '3 May 2017',
    city: 'POURRIERES',
    place: 'Caserne des sapeurs pompiers',
    address: 'Chemin de la Halte, 83910 Pourrières',
    coord: '43.4957617,5.7315493',
  },
  {
    step: 'ETAPE 4',
    date: '4 May 2017',
    city: 'AIX EN PROVENCES',
    place: 'Centre de secours principal',
    address: '40 Allée des Dolia, 13100 Aix-en-Provence, France',
    coord: '43.5456582,5.4298911',
  },
  {
    step: 'ETAPE 5',
    date: '5 May 2017',
    city: 'MALLEMORT',
    place: 'Caserne des sapeurs pompiers',
    address: '53 avenue des Frères Roqueplan, 13370 MALLEMORT',
    coord: '43.7337933,5.1695448',
  },
  {
    step: 'ETAPE 6',
    date: '6 May 2017',
    city: 'CAUMONT-SUR-DURANCE',
    place: 'Mairie',
    address: '1945 Place du Huit Mai 1945, 84510 Caumont-sur-Durance',
    coord: '43.8930321,4.9446256',
  },
  {
    step: 'ETAPE 7',
    date: '7 May 2017',
    city: 'ROQUEMAURE',
    place: 'Caserne des sapeurs pompiers',
    address: 'Rue Carnot, 30150 Roquemaure',
    coord: '44.0508207,4.7773201',
  },
  {
    step: 'ETAPE 8',
    date: '8 May 2017',
    city: 'SAINT-GERVAIS',
    place: 'Mairie',
    address: "50 Avenue du Mont d'Arbois, 74170 Saint-Gervais-les-Bains",
    coord: '45.897452,6.7113356',
  },
  {
    step: 'ETAPE 9',
    date: '9 May 2017',
    city: 'BESSAS',
    place: 'Mairie',
    address: 'Le Village, 07150 Bessas',
    coord: '44.3444848,4.2993763',
  },
  {
    step: 'ETAPE 10',
    date: '10 May 2017',
    city: 'ST-PIERRE-ST-JEAN',
    place: 'Mairie',
    address: 'La combe, 07140 Saint-Pierre-Saint-Jean',
    coord: '44.4730568,4.085803',
  },
  {
    step: 'ETAPE 11',
    date: '11 May 2017',
    city: 'ASTET',
    place: 'Mairie',
    address: 'La chavade,07330 Astet',
    coord: '44.6971918,4.0248696',
  },
  {
    step: 'ETAPE 12',
    date: '12 May 2017',
    city: 'Le BOUCHET-SAINT-NICOLAS',
    place: 'Mairie',
    address: 'Le Bourg, 43510 Le Bouchet-Saint-Nicolas, France',
    coord: '44.8902518,3.7204372',
  },
  {
    step: 'ETAPE 13',
    date: '13 May 2017',
    city: 'SIAUGUE STE-MARIE',
    place: 'Caserne des sapeurs pompiers',
    address: 'Le Bourg, 43300 Siaugues-Sainte-Marie, France',
    coord: '45.0937624,3.6309431',
  },
  {
    step: 'ETAPE 14',
    date: '14 May 2017',
    city: 'BRIOUDE',
    place: 'Centre de secours principal',
    address: 'Rue Rabelais, 43100 Brioude, France',
    coord: '45.2891893,3.3747657',
  },
  {
    step: 'ETAPE 15',
    date: '15 May 2017',
    city: 'ISSOIRE',
    place: 'Centre de secours principal',
    address: '4 Avenue Pierre et Marie Curie, 63500 Issoire, France',
    coord: '45.5502401,3.2544559',
  },
  {
    step: 'ETAPE 16',
    date: '16 May 2017',
    city: 'AUBIERE',
    place: 'Centre de secours principal',
    address: '3 Rue de la Ganne, 63170 Aubière, France',
    coord: '45.7549628,3.1178066',
  },
  {
    step: 'ETAPE 17',
    date: '17 May 2017',
    city: 'COMBRONDE',
    place: 'Centre de secours',
    address: '57 bis, belle allée - 63460 COMBRONDE',
    coord: '45.9841143,3.0951205',
  },
  {
    step: 'ETAPE 18',
    date: '18 May 2017',
    city: 'SAINT-ELOY-LES-MINES',
    place: 'Centre de secours',
    address: 'Route des bayons - 63700 ST ELOY LES MINES',
    coord: '46.162315,2.840868',
  },
  {
    step: 'ETAPE 19',
    date: '19 May 2017',
    city: 'MONTLUÇON',
    place: 'Mairie',
    address: 'Montluçon - Place Jean Dormoy',
    coord: '46.346385,2.595914',
  },
  {
    step: 'ETAPE 20',
    date: '20 May 2017',
    city: 'MEAULNE',
    place: 'Mairie',
    address: '12 Place de la Mairie, 03360 Meaulne, France',
    coord: '46.5981557,2.615121',
  },
  {
    step: 'ETAPE 21',
    date: '21 May 2017',
    city: 'ORVAL',
    place: 'Mairie',
    address: 'Place de la République,18200 Saint-Amand-Montrond',
    coord: '46.7226579,2.5016612',
  },
  {
    step: 'ETAPE 22',
    date: '22 May 2017',
    city: 'PLAIMPIED GIVAUDINS',
    place: 'Centre de secours principal',
    address: 'Impasse Vincent Van Gogh, 18340 Plaimpied-Givaudins, France',
    coord: '46.9954964,2.4524944',
  },
  {
    step: 'ETAPE 23',
    date: '23 May 2017',
    city: 'SAINT PALAIS',
    place: 'Mairie',
    address: 'Place de la République,18200 Saint-Amand-Montrond',
    coord: '46.7226579,2.5016612',
  },
  {
    step: 'ETAPE 24',
    date: '24 May 2017',
    city: 'AUBIGNY SUR NERE',
    place: 'Centre de secours',
    address: '1 Rue de la Croix de Mauconseil, 18700 Aubigny-sur-Nère, France',
    coord: '47.4881342,2.4288107',
  },
  {
    step: 'ETAPE 25',
    date: '25 May 2017',
    city: 'SULLY SUR LOIRE',
    place: "Centre de secours et d'incendie",
    address: 'Chemin de la Pillardière, 45600 Sully-sur-Loire, France',
    coord: '47.7488095,2.3637844',
  },
  {
    step: 'ETAPE 26',
    date: '26 May 2017',
    city: 'BELLEGARDE',
    place: 'Centre de secours',
    address: 'Place Jules Ferry, 45270 Bellegarde, France',
    coord: '47.9879225,2.4410716',
  },
  {
    step: 'ETAPE 27',
    date: '27 May 2017',
    city: 'PITHIVIERS',
    place: 'Centre de secours principal',
    address: '2 Avenue du Maréchal Berthier, 45300 Pithiviers, France',
    coord: '48.1689196,2.2527319',
  },
  {
    step: 'ETAPE 28',
    date: '28 May 2017',
    city: 'ETAMPES',
    place: 'Centre de secours principal',
    address: 'Place du Marché Franc, 91150 Étampes, France',
    coord: '48.4299325,2.154203',
  },
  {
    step: 'ETAPE 29',
    date: '29 May 2017',
    city: 'MONTLÉRY',
    place: 'Centre de secours',
    address: 'Rue du Pont aux Pins, 91310, France',
    coord: '48.6496319,2.2737027',
  },
  {
    step: 'ETAPE 30',
    date: '30 May 2017',
    city: 'PARIS',
    place: 'Champs de mars',
    address: 'Champs de mars, 75007 Paris',
    coord: '48.8529629,2.2988608',
    icon: `${CDN}/icons/Paris_Etape.png`,
    bigger: true,
  },
  {
    step: 'ETAPE 31',
    date: '31 May 2017',
    city: 'MERY-SUR-OISE',
    place: 'Centre de secours',
    address: 'Rue Courtil Bajou, 95540 Méry-sur-Oise, France',
    coord: '49.0654984,2.1797712',
  },
  {
    step: 'ETAPE 32',
    date: '1 June 2017',
    city: 'MÉRU',
    place: 'Centre de secours',
    address: '44 Rue Aristide Briand, 60110 Méru, France',
    coord: '49.218468,2.1275359',
  },
  {
    step: 'ETAPE 33',
    date: '2 June 2017',
    city: 'BEAUVAIS',
    place: 'Mairie',
    address: '1 Rue Desgroux, 60000 Beauvais, France',
    coord: '49.4296231,2.0796659',
  },
  {
    step: 'ETAPE 34',
    date: '3 June 2017',
    city: 'GRANDVILLIERS',
    place: 'Centre de secours',
    address: '10 Place de la Censé, 60210 Grandvilliers, France',
    coord: '49.6660249,1.9332546',
  },
  {
    step: 'ETAPE 35',
    date: '4 June 2017',
    city: 'MOLLIENS-DREUIL',
    place: 'Centre de secours',
    address: 'Rue des Airettes, 80540 Molliens-Dreuil, France',
    coord: '49.8888687,2.0253702',
  },
  {
    step: 'ETAPE 36',
    date: '5 June 2017',
    city: 'ABBEVILLE',
    place: 'Centre de secours principal',
    address: '3 Avenue du Rivage, 80100 Abbeville, France',
    coord: '50.1034317,1.8303492',
  },
  {

    step: 'ETAPE 37',
    date: '6 June 2017',
    city: 'QUEND',
    place: 'Mairie',
    address: '1 Rue de la Mairie, 80120 Quend',
    coord: '50.3161951,1.6324792',
  },
  {
    step: 'ETAPE 38',
    date: '7 June 2017',
    city: 'ETAPLES',
    place: 'Centre de secours',
    address: "Parc d'Activité Opalopolis, Boulevard Edouard Lévêque, 62630 Étaples",
    coord: '50.5070501,1.6667426',
  },
  {
    step: 'ETAPE 39',
    date: '9 June 2017',
    city: 'RETY',
    place: 'Mairie',
    address: "Parc naturel régional des Caps et Marais d'Opale, 11 Rue Jules Ferry, 62720 Rety",
    coord: '50.7978461,1.7745939',
  },
  {
    step: 'ETAPE 40',
    date: '10 June 2017',
    city: 'CALAIS',
    place: 'Mairie',
    address: 'Place du Soldat Inconnu, 62100 Calais, France',
    coord: '50.9528474,1.8522773',
    icon: `${CDN}/icons/Calais_Etape.png`,
    bigger: true,
  },
];

export default ({ fragmentsMap, asyncMapFragments }) => {
  for (let i = 0; i < fragmentsMap.length; ++i) {
    if (!fragmentsMap[i]) {
      return null;
    }
  }

  // const startPoint = fragmentsMap[0].routes[0].legs[0].start_location;
  // const endPoint = fragmentsMap[fragmentsMap.length - 1].routes[0].legs[0].end_location;
  return (<div>
    {asyncMapFragments.map((fragment, i) =>
      <DirectionsRenderer key={i} directions={fragmentsMap[i]} options={{ suppressMarkers: true, preserveViewport: true }} />,
    )}
    { allSteps.map(step => <MapMarker
      animation={0}
      key={step.step}
      id={step.step}
      bigger={step.bigger}
      showOnOver
      smaller={!step.bigger}
      position={{ lat: +step.coord.split(',')[0], lng: +step.coord.split(',')[1] }}
      iconUrl={step.icon || `${CDN}/icons/SmallEtape.png`}
      {...step}
      type="step"
    />)}

  </div>);
};
