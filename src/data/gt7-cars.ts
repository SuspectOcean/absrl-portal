// Comprehensive GT7 Gr.3 car list organized by manufacturer
// Used for car selection dropdowns in admin

export interface GT7Car {
  name: string;
  slug: string;
  class: string;
}

export interface ManufacturerGroup {
  manufacturer: string;
  cars: GT7Car[];
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const GT7_GR3_CARS: ManufacturerGroup[] = [
  {
    manufacturer: "Aston Martin",
    cars: [
      { name: "Aston Martin V12 Vantage GT3", slug: slugify("Aston Martin V12 Vantage GT3"), class: "Gr.3" },
      { name: "Aston Martin Vantage GT3 '24", slug: slugify("Aston Martin Vantage GT3 24"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Audi",
    cars: [
      { name: "Audi R8 LMS Evo '19", slug: slugify("Audi R8 LMS Evo 19"), class: "Gr.3" },
      { name: "Audi R8 LMS Evo II '22", slug: slugify("Audi R8 LMS Evo II 22"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "BMW",
    cars: [
      { name: "BMW M4 GT Endurance Model", slug: slugify("BMW M4 GT Endurance Model"), class: "Gr.3" },
      { name: "BMW M6 GT3 Endurance Model", slug: slugify("BMW M6 GT3 Endurance Model"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Chevrolet",
    cars: [
      { name: "Chevrolet Corvette C7 GT3", slug: slugify("Chevrolet Corvette C7 GT3"), class: "Gr.3" },
      { name: "Chevrolet Corvette C8.R", slug: slugify("Chevrolet Corvette C8R"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Dodge",
    cars: [
      { name: "Dodge Viper GTS-R GT3", slug: slugify("Dodge Viper GTS-R GT3"), class: "Gr.3" },
      { name: "Dodge SRT Tomahawk GTS-R VGT", slug: slugify("Dodge SRT Tomahawk GTS-R VGT"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Ferrari",
    cars: [
      { name: "Ferrari 296 GT3", slug: slugify("Ferrari 296 GT3"), class: "Gr.3" },
      { name: "Ferrari 458 Italia GT3", slug: slugify("Ferrari 458 Italia GT3"), class: "Gr.3" },
      { name: "Ferrari 488 GT3", slug: slugify("Ferrari 488 GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Ford",
    cars: [
      { name: "Ford GT LM Spec II Test Car", slug: slugify("Ford GT LM Spec II Test Car"), class: "Gr.3" },
      { name: "Ford Mustang GT3", slug: slugify("Ford Mustang GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Genesis",
    cars: [
      { name: "Genesis X GR3", slug: slugify("Genesis X GR3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Honda",
    cars: [
      { name: "Honda NSX Gr.3", slug: slugify("Honda NSX Gr3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Jaguar",
    cars: [
      { name: "Jaguar F-type GT3", slug: slugify("Jaguar F-type GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Lamborghini",
    cars: [
      { name: "Lamborghini Huracán GT3", slug: slugify("Lamborghini Huracan GT3"), class: "Gr.3" },
      { name: "Lamborghini Huracán GT3 Evo", slug: slugify("Lamborghini Huracan GT3 Evo"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Lexus",
    cars: [
      { name: "Lexus RC F GT3", slug: slugify("Lexus RC F GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Mazda",
    cars: [
      { name: "Mazda RX-Vision GT3 Concept", slug: slugify("Mazda RX-Vision GT3 Concept"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "McLaren",
    cars: [
      { name: "McLaren 650S GT3", slug: slugify("McLaren 650S GT3"), class: "Gr.3" },
      { name: "McLaren 720S GT3", slug: slugify("McLaren 720S GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Mercedes-Benz",
    cars: [
      { name: "Mercedes-AMG GT3", slug: slugify("Mercedes-AMG GT3"), class: "Gr.3" },
      { name: "Mercedes-AMG GT3 '20", slug: slugify("Mercedes-AMG GT3 20"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Mitsubishi",
    cars: [
      { name: "Mitsubishi Lancer Evolution Final Edition Gr.3", slug: slugify("Mitsubishi Lancer Evolution Final Edition Gr3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Nissan",
    cars: [
      { name: "Nissan GT-R NISMO GT3", slug: slugify("Nissan GT-R NISMO GT3"), class: "Gr.3" },
      { name: "Nissan GT-R NISMO GT3 '18", slug: slugify("Nissan GT-R NISMO GT3 18"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Peugeot",
    cars: [
      { name: "Peugeot RCZ GT3", slug: slugify("Peugeot RCZ GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Porsche",
    cars: [
      { name: "Porsche 911 RSR (2017)", slug: slugify("Porsche 911 RSR 2017"), class: "Gr.3" },
      { name: "Porsche 911 GT3 R (991) '18", slug: slugify("Porsche 911 GT3 R 991 18"), class: "Gr.3" },
      { name: "Porsche 911 GT3 R (992) '22", slug: slugify("Porsche 911 GT3 R 992 22"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Renault",
    cars: [
      { name: "Renault R.S.01 GT3", slug: slugify("Renault RS01 GT3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Subaru",
    cars: [
      { name: "Subaru WRX Gr.3", slug: slugify("Subaru WRX Gr3"), class: "Gr.3" },
    ],
  },
  {
    manufacturer: "Toyota",
    cars: [
      { name: "Toyota GR Supra Racing Concept", slug: slugify("Toyota GR Supra Racing Concept"), class: "Gr.3" },
      { name: "Toyota GR Supra GT3", slug: slugify("Toyota GR Supra GT3"), class: "Gr.3" },
    ],
  },
];

export default GT7_GR3_CARS;
