import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ShoppingCart, Edit, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MenuCourses {
  starters: string;
  mains: string;
  rice: string;
  sides: string;
  desserts: string;
}

interface Menu {
  title: string;
  price: number;
  servings: number;
  courses: MenuCourses;
}

interface PriceMultipliers {
  [key: string]: {
    basic: number;
    premium: number;
    deluxe: number;
  };
}

interface MenuTemplates {
  [key: string]: {
    starters: string[];
    mains: string[];
    rice: string[];
    sides: string[];
    desserts: string[];
  };
}

const MenuGeneratorHomepage: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedMenus, setGeneratedMenus] = useState<Menu[]>([]);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [customMenu, setCustomMenu] = useState<MenuCourses | null>(null);
  const [showCheckout, setShowCheckout] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const menuTemplates: MenuTemplates = {
    italian: {
      starters: ['Bruschetta', 'Caprese Salad', 'Minestrone Soup'],
      mains: ['Osso Buco', 'Risotto', 'Pasta Carbonara'],
      rice: ['Risotto alla Milanese', 'Wild Mushroom Risotto'],
      sides: ['Grilled Vegetables', 'Garlic Bread'],
      desserts: ['Tiramisu', 'Panna Cotta', 'Cannoli']
    },
    indian: {
      starters: ['Samosa', 'Pakora', 'Papadum'],
      mains: ['Butter Chicken', 'Paneer Tikka', 'Dal Makhani'],
      rice: ['Jeera Rice', 'Biryani', 'Pulao'],
      sides: ['Naan', 'Raita', 'Papadum'],
      desserts: ['Gulab Jamun', 'Kheer', 'Rasmalai']
    },
    chinese: {
      starters: ['Egg Rolls', 'Dumplings', 'Wonton Soup'],
      mains: ['Kung Pao Chicken', 'Beef with Broccoli', 'Shrimp'],
      rice: ['Steamed Rice', 'Fried Rice'],
      sides: ['Egg Fried Rice', 'Vegetable Spring Rolls'],
      desserts: ['Almond Cookies', 'Fortune Cookies']
    }
  };

  type MenuCourseKey = keyof MenuCourses;

  const priceMultipliers: PriceMultipliers = {
    budget: { basic: 15, premium: 25, deluxe: 40 },
    moderate: { basic: 25, premium: 45, deluxe: 75 },
    luxury: { basic: 45, premium: 85, deluxe: 150 }
  };

  const foodImages: string[] = [
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR7NvqKXOEvYDD0Yv0lIEsKgUEB85PCwJ-ew&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMPyDnCQvfUSDwC9Or9f4Cqi9S2fcvHcmURw&s', 
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSouIr6HAohXhHT_Up-zp7M72Ki3sgLPLVwCw&s'
  ];

  const parsePrompt = (prompt: string) => {
    const cuisine = prompt.toLowerCase().includes('italian') ? 'italian' : 
                    prompt.toLowerCase().includes('indian') ? 'indian' :
                    prompt.toLowerCase().includes('chinese') ? 'chinese' :
                    'italian';
    
    const priceLevel = prompt.toLowerCase().includes('budget') ? 'budget' :
                       prompt.toLowerCase().includes('luxury') ? 'luxury' : 
                       'moderate';
    
    const servings = parseInt(prompt.match(/(\d+)\s*people/)?.[1] || '400');

    return { cuisine, priceLevel, servings };
  };

  const generateMenus = () => {
    setLoading(true);
    const details = parsePrompt(prompt);
    const prices = priceMultipliers[details.priceLevel];
    const cuisine = menuTemplates[details.cuisine];

    const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    const newMenus: Menu[] = [
      {
        title: "Basic Package",
        price: prices.basic,
        servings: details.servings,
        courses: {
          starters: getRandom(cuisine.starters),
          mains: getRandom(cuisine.mains),
          rice: getRandom(cuisine.rice),
          sides: getRandom(cuisine.sides),
          desserts: getRandom(cuisine.desserts)
        }
      },
      {
        title: "Premium Package",
        price: prices.premium,
        servings: details.servings,
        courses: {
          starters: getRandom(cuisine.starters),
          mains: getRandom(cuisine.mains),
          rice: getRandom(cuisine.rice),
          sides: getRandom(cuisine.sides),
          desserts: getRandom(cuisine.desserts)
        }
      },
      {
        title: "Deluxe Package",
        price: prices.deluxe,
        servings: details.servings,
        courses: {
          starters: getRandom(cuisine.starters),
          mains: getRandom(cuisine.mains),
          rice: getRandom(cuisine.rice),
          sides: getRandom(cuisine.sides),
          desserts: getRandom(cuisine.desserts)
        }
      }
    ];

    setTimeout(() => {
      setGeneratedMenus(newMenus);
      setLoading(false);
    }, 1000);
  };

  const handleCheckout = (menu: Menu) => {
    setSelectedMenu(menu);
    setShowCheckout(true);
  };

  const calculateTotalPrice = (menu: Menu) => {
    const basePrice = menu.price * menu.servings;
    const tax = basePrice * 0.1;
    return basePrice + tax;
  };

  const handleCustomization = (menu: Menu) => {
    setSelectedMenu(menu);
    setCustomMenu({ ...menu.courses });
    setEditDialogOpen(true);
  };

  const updateMenuItem = (course: string, value: string) => {
    if (isMenuCourseKey(course)) {
      setCustomMenu(prev => prev ? ({
        ...prev,
        [course]: value
      }) : null);
    }
  };

  const isMenuCourseKey = (key: string): key is MenuCourseKey => {
    return ['starters', 'mains', 'rice', 'sides', 'desserts'].includes(key);
  };

  const saveCustomizations = () => {
    const updatedMenus = generatedMenus.map(menu => 
      menu === selectedMenu && customMenu ? { ...menu, courses: customMenu } : menu
    );
    setGeneratedMenus(updatedMenus);
    setEditDialogOpen(false);
  };

  const confirmOrder = () => {
    setShowCheckout(false);
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            DICE MENU
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create personalized menus for any occasion. Simply describe your event, and we'll generate perfectly curated menu options.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8 mb-8">
          <Label className="mb-4 block text-lg font-semibold">
            Describe Your Meal Requirements
          </Label>
          <Textarea 
            placeholder="Enter cuisine (Italian/Indian/Chinese), price level (budget/moderate/luxury), number of people"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="mb-6 w-full"
          />
          <Button 
            onClick={generateMenus}
            disabled={loading}
            className="w-full text-lg py-3"
          >
            {loading ? 'Generating...' : 'Generate Menus'}
          </Button>
        </div>

        {generatedMenus.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-100 transition-opacity duration-500">
            {generatedMenus.map((menu, index) => (
              <Card key={index} className="w-full">
                <CardHeader>
                  <CardTitle>{menu.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-indigo-600 mb-4">
                    ${menu.price} per person
                  </div>
                  <table className="w-full mb-4">
                    <tbody>
                      {Object.entries(menu.courses).map(([course, dish]) => (
                        <tr key={course} className="border-b">
                          <td className="py-2 capitalize font-medium">{course}</td>
                          <td className="py-2">{dish}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleCustomization(menu)}
                      className="flex-1"
                    >
                      <Edit className="mr-2" /> Customize
                    </Button>
                    <Button 
                      onClick={() => handleCheckout(menu)}
                      className="flex-1"
                    >
                      <ShoppingCart className="mr-2" /> Checkout
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

<motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {foodImages.map((src, index) => (
            <div 
              key={index} 
              className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all"
            >
              <img 
                src={src} 
                alt={`Cuisine ${index + 1}`} 
                className="w-full h-64 object-cover transform hover:scale-105 transition-transform"
              />
            </div>
          ))}
        </motion.div>

        {/* Customization Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customize Your Menu</DialogTitle>
            </DialogHeader>
            {selectedMenu && Object.entries(selectedMenu.courses).map(([course, dish]) => (
    <div key={course} className="mb-4">
      <Label className="capitalize">{course}</Label>
      <Input 
        placeholder={`Enter custom ${course}`}
        value={customMenu?.[course as MenuCourseKey] || dish}
        onChange={(e) => updateMenuItem(course, e.target.value)}
      />
    </div>
  ))}
            <DialogClose asChild>
              <Button onClick={saveCustomizations}>Save Customizations</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>

        {/* Checkout Dialog */}
        <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Order Summary</DialogTitle>
              <DialogDescription>
                Review your selected menu and confirm your order
              </DialogDescription>
            </DialogHeader>
            
            {selectedMenu && (
              <div className="space-y-4">
                <h3 className="font-bold text-lg">{selectedMenu.title}</h3>
                <table className="w-full">
                  <tbody>
                    {Object.entries(selectedMenu.courses).map(([course, dish]) => (
                      <tr key={course} className="border-b">
                        <td className="py-2 capitalize font-medium">{course}</td>
                        <td className="py-2">{dish}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="bg-gray-100 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span>Base Price</span>
                    <span>${selectedMenu.price * selectedMenu.servings}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Servings</span>
                    <span>{selectedMenu.servings} people</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax (10%)</span>
                    <span>${(selectedMenu.price * selectedMenu.servings * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateTotalPrice(selectedMenu).toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-6">
                  <Button 
                    variant="outline"
                    onClick={() => setShowCheckout(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={confirmOrder}
                    className="flex-1"
                  >
                    Confirm Order
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="flex flex-col items-center">
                <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Order Confirmed!
                </h2>
                <p className="text-gray-600">
                  Thank you for your order. We'll start preparing your meal right away.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuGeneratorHomepage;