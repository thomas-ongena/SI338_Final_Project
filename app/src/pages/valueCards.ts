// Define the type for a value card
type ValueCard = {
  title: string;
  description: string;
  image: string;
};

// Define 4 value cards
export const valueCards: ValueCard[] = [
  {
    title: 'Supply Chain Carbon Savings',
    description:
      'TMG tracks and quantifies how its services affect the corporate supply chains with regard to reducing CO2 emissions. In 2022, our OEM clients reduce their greenhouse gas (GHG) emissions by 38,949 tons of CO2!',
    image: require('../assets/trees_tmg.jpg'),
  },
  {
    title: 'Property Tax Improvements',
    description:
      "TMG delivers to OEM's an effective solution for improving property tax management, ensuring compliance (accuracy) and maximizing savings (obsolete record removal).",
    image: require('../assets/tax_tmg.png'),
  },
  {
    title: 'Supplier Cost Reduction',
    description: "TMG's services help suppliers reduce and manage costs associated with warehousing, maintenance, transportation and dispositions.",
    image: require('../assets/logistics_tmg.jpg'),
  },
  {
    title: 'Organized Supply Chain Data',
    description:
      'TMG delivers clean, accurate supply chain data as a service, ensuring ERP systems are built on complete records for confident decision-making.',
    image: require('../assets/data_value_tmg.jpg'),
  },
];