import catHoodie  from '../assets/categorie/hoodie.jpg'
import catJeans   from '../assets/categorie/jeans.jpg'
import catTees    from '../assets/categorie/tees.jpg'
import catJacket  from '../assets/categorie/jacket.jpg'
import catCap  from '../assets/categorie/cap.jpg'

export const categories = [
  {
    id: 1,
    name: "Hoodies",
    image: catHoodie,
    count: 8,
    span: "col-span-2 row-span-2",
  },
  {
    id: 2,
    name: "Jeans",
    image: catJeans,
    count: 6,
    span: "col-span-1 row-span-1",
  },
  {
    id: 3,
    name: "Caps",
    image: catCap,
    count: 4,
    span: "col-span-1 row-span-1",
  },
  {
    id: 4,
    name: "Tshirts",
    image: catTees,
    count: 12,
    span: "col-span-1 row-span-1",
  },
  {
    id: 5,
    name: "Jackets",
    image: catJacket,
    count: 5,
    span: "col-span-1 row-span-1",
  },
]

export const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export const types = ['Normal', 'Oversize']

export const brands = [
  { name: "Nike", logo: "NIKE" },
  { name: "Adidas", logo: "ADIDAS" },
  { name: "Jordan", logo: "JORDAN" },
  { name: "Puma", logo: "PUMA" },
  { name: "Supreme", logo: "SUPREME" },
  { name: "Bape", logo: "BAPE" },
  { name: "Off-White", logo: "OFF-WHITE" },
  { name: "Palace", logo: "PALACE" },
]
