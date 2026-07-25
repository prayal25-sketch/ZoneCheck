// Static data for First Aid Guides based on the prompt requirements
const firstAidGuides = [
  {
    type: 'bleeding',
    severity: 'life-threatening',
    instructions: [
      'Apply direct, firm pressure to the wound with a clean cloth or bandage.',
      'Elevate the injured area above the heart if possible.',
      'Do not remove the cloth if it soaks through; add more layers on top.',
      'Keep the person warm to prevent shock.'
    ],
    warnings: [
      'Do NOT remove the initial dressing, as it disrupts clotting.',
      'Do NOT apply a tourniquet unless you are trained and bleeding is uncontrollable.'
    ],
    immediateActions: ['Apply Pressure', 'Elevate'],
    callEmergencyIf: 'Bleeding does not stop after 10 minutes of pressure, or blood is spurting.',
    offlineAvailable: true
  },
  {
    type: 'burns',
    severity: 'serious',
    instructions: [
      'Cool the burn under cool (not cold) running water for 10-20 minutes.',
      'Remove jewelry or tight items from the burned area before it swells.',
      'Cover the burn loosely with sterile gauze or a clean cloth.'
    ],
    warnings: [
      'Do NOT pop blisters.',
      'Do NOT apply ice, butter, ointments, or cotton balls to the burn.'
    ],
    immediateActions: ['Cool the burn', 'Remove tight items'],
    callEmergencyIf: 'The burn is larger than 3 inches, on the face/hands/genitals, or looks charred/white.',
    offlineAvailable: true
  }
  // Add other 10 types similarly...
];

exports.getAllGuides = (req, res) => {
  res.json(firstAidGuides);
};

exports.getGuideByType = (req, res) => {
  const { type } = req.params;
  const guide = firstAidGuides.find(g => g.type === type.toLowerCase());
  
  if (!guide) {
    return res.status(404).json({ message: 'Guide not found for this emergency type' });
  }
  
  res.json(guide);
};

exports.getOfflinePack = (req, res) => {
  // Returns all offline-available guides for local caching
  res.json(firstAidGuides.filter(g => g.offlineAvailable));
};
