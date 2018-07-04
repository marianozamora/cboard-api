var Communicator = require('../models/Communicator');

module.exports = {
  createCommunicator: createCommunicator,
  listCommunicators: listCommunicators,
  getCommunicator: getCommunicator,
  updateCommunicator: updateCommunicator,
  removeCommunicator: removeCommunicator,
  getCommunicatorsEmail: getCommunicatorsEmail
};

function createCommunicator(req, res) {
  var communicator = new Communicator(req.body);
  communicator.save(function(err, communicator) {
    if (err) {
      return res.status(409).json({
        message: 'Error saving communicator',
        error: err
      });
    }
    return res.status(200).json({
      success: 1,
      id: communicator._id,
      communicator: {
        id: communicator._id,
        name: communicator.name,
        author: communicator.author,
        email: communicator.email,
        description: communicator.description,
        rootBoard: communicator.rootBoard,
        boards: communicator.boards
      },
      message: 'Communicator saved successfully'
    });
  });
}

function listCommunicators(req, res) {
  Communicator.find(function(err, communicators) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting communicators list.',
        error: err
      });
    }
    return res.status(200).json(communicators);
  });
}

function getCommunicatorsEmail(req, res) {
  var email = req.swagger.params.email.value;
  Communicator.find({ email: email }, function(err, communicators) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting communicators list.',
        error: err
      });
    }
    return res.status(200).json(communicators);
  });
}

function getCommunicator(req, res) {
  var id = req.swagger.params.id.value;
  Communicator.findById(id, function(err, communicator) {
    if (err) {
      return res.status(500).json({
        message: 'Error getting board. ',
        error: err
      });
    }

    if (!communicator) {
      return res.status(404).json({
        message: `Communicator does not exist. Communicator ID: ${id}`
      });
    }

    return res.status(200).json(communicator);
  });
}

function updateCommunicator(req, res) {
  const id = req.swagger.params.id.value;
  Communicator.findById(id, function(err, communicator) {
    if (err) {
      return res.status(500).json({
        message: 'Error updating communicator.',
        error: err
      });
    }

    if (!communicator) {
      console.log(id, communicator);
      return res.status(404).json({
        message: `Unable to find communicator. Communicator ID: ${id}`
      });
    }

    // Validate rootBoard is present in boards field
    const rootBoard = req.body.rootBoard || communicator.rootBoard;
    const boards = req.body.boards || communicator.boards;

    if (boards.indexOf(rootBoard) < 0) {
      return res.status(400).json({
        message: `RootBoard '${rootBoard}' does not exist in boards: ${boards.join(
          ', '
        )}`,
        error: err
      });
    }

    for (let key in req.body) {
      communicator[key] = req.body[key];
    }

    communicator.save(function(err, communicator) {
      if (err) {
        return res.status(500).json({
          message: 'Error saving communicator.',
          error: err
        });
      }

      if (!communicator) {
        return res.status(404).json({
          message: `Unable to find communicator. Communicator Id: ${id}`
        });
      }
    });

    return res.status(200).json(communicator);
  });
}

function removeCommunicator(req, res) {
  const id = req.swagger.params.id.value;
  Communicator.findByIdAndRemove(id, function(err, communicator) {
    if (err) {
      return res.status(404).json({
        message: `Communicator not found. Communicator Id: ${id}`,
        error: err
      });
    }

    return res.status(200).json(communicator);
  });
}
