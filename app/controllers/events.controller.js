const Event = require('../models/event');

module.exports = {
    showEvents: showEvents,
    showSingle: showSingle,
    seedEvents: seedEvents,
    showCreate: showCreate,
    processCreate: processCreate,
    showEdit: showEdit,
    processEdit: processEdit,
    deleteEvent: deleteEvent
}

function showEvents(req, res) {
    //  get all events
    Event.find({}, (err, events) => {
        if (err) {
            res.status(404);
            res.send('Events not found!');
        }

        // return a view with data
        res.render('pages/events', { 
            events: events,
            success: req.flash('success') 
        });
    });
    
}

// show a single events
function showSingle(req, res) {
    //get a single events
   Event.findOne({ slug: req.params.slug }, (err, event) => {
        if (err) {
            res.status(404);
            res.send('Event not found!');
        }
            res.render('pages/single', { 
                event: event,
                success: req.flash('success')
            });
   });
   
}

// seed our database
function seedEvents(req, res) {
    

        // use the Event model to insert/save
        Event.remove({}, () => {
            for (event of events) {
                var newEvent = new Event(event);
                newEvent.save();
            }
        });
        // seeded!
        res.send('Database seeded!');
    }

// show the create form 
function showCreate(req, res) {
    res.render('pages/create', {
        errors: req.flash('errors')
    });
}

// process the creation form
function processCreate(req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('description', 'Message is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/events/create');
    }

    // create a new event
    const event = new Event({
        name: req.body.name,
        email: req.body.email,
        description: req.body.description
    });

    // save event
    event.save((err) => {
        if (err)
            throw err;

        // set a successful flash message
        req.flash('success', 'Sucessfully created event!')

        // redirect to the newly created event
        res.redirect(`/events/${event.slug}`);
    });
}

// Show the edit form
function showEdit(req, res) {
    Event.findOne({ slug: req.params.slug }, (err, event) => {
            res.render('pages/edit', {
                event: event,
                errors: req.flash('errors')
            });
    });
}

//process the edit form
function processEdit(req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('description', 'Message is required.').notEmpty();

    // if there are errors, redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/events/${req.params.slug}/edit`);
    }

    // finding a current event
    Event.findOne({ slug: req.params.slug }, (err, event) => {
            // handle updating the event
            event.name = req.body.name;
            event.email = req.body.email;
            event.description = req.body.description;

            event.save((err) => {
                if (err)
                    throw err;
            
            // success flash message
            req.flash('success', 'Successfully updated event.');

            // redirect the user back to the /events
            res.redirect('/events');    
            });
    });

}

// delete an event
function deleteEvent (req, res) {
    Event.remove({ slug:req.params.slug }, (err) => {
        // set flash data

        // redirect back to the events pages
        req.flash('success', 'Event deleted!');
        res.redirect('/events');
    });
}