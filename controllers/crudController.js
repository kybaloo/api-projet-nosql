


exports.getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.find();
    res.status(200).json({
      status: 'success',
      count: items.length,
      data: items
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


exports.getOne = (Model, popOptions) => async (req, res) => {
  try {
    let query = Model.findById(req.params.id);
    
    if (popOptions) {
      query = query.populate(popOptions);
    }
    
    const item = await query;
    
    if (!item) {
      return res.status(404).json({
        status: 'fail',
        message: 'Élément non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: item
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
};


exports.createOne = (Model) => async (req, res) => {
  try {
    const newItem = await Model.create(req.body);
    
    res.status(201).json({
      status: 'success',
      data: newItem
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.updateOne = (Model) => async (req, res) => {
  try {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,         
      runValidators: true 
    });
    
    if (!item) {
      return res.status(404).json({
        status: 'fail',
        message: 'Élément non trouvé'
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: item
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};


exports.deleteOne = (Model) => async (req, res) => {
  try {
    const item = await Model.findByIdAndDelete(req.params.id);
    
    if (!item) {
      return res.status(404).json({
        status: 'fail',
        message: 'Élément non trouvé'
      });
    }
    
    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message
    });
  }
}; 
