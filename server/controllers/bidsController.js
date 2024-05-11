const { Console } = require('console');
const Bid = require('../models/bidsmodel');
const Product = require('../models/product');
const User = require('../models/user');
const Cart = require('../models/cartmodel');
const BidRoom = require('../models/bidRoommodel')
const Settings = require('../models/generalsettingsmodel')
const path = require('path');


exports.createBid = async(req, res, next) => {
    console.log('req.body: ', req.body);
    const room = await BidRoom.findById(req.body.bidroomId);
    const product = await Product.findById(room.product)
    console.log(room);
    try{
        const bid = new Bid({
            bidRoom: room,
            product : product._id,
            customer: req.body.userId,
            amount: req.body.bidAmount
        })
        bid.save();
        console.log(bid);
        room.updateAt = Date.now();
        await room.save();
        res.status(201).json({data: bid})
    }catch(error){
        console.error("Error creating bids");
        res.status(500).json({error:'internal Server Error'});
    }
};

exports.fetchBids = async(req, res, next) => {
    try{
        const user_id = req.body.user_id
        const bids = await Bid.find({customer: user_id}).populate({ path: 'product', populate: { path: 'seller' } }).exec();
        console.log(bids)
        res.json(bids);
    } catch (error) {
        console.log('Error fetching bids: ', error);
        res.status(500).json({ error: 'Error Fetching bids'});
    }
};

exports.fetchBids_products = async(req, res, next) => {
    console.log("fetching bids for seller product page")
    const productId = req.params.productId;
    const bidrooms = await BidRoom.find({ product: productId }).populate('product').sort({ createdAt: -1 });
    const bidRoomsAndBids = [];
    for (const bidroom of bidrooms) {
        const bids = await Bid.find({ bidRoom: bidroom._id })
            .sort({ amount: -1 })
            .limit(5)
            .populate('customer')
            .exec();
        bidRoomsAndBids.push({ bidroom, bids });
    }

    const product = await Product.findById(productId).exec();
    res.json({ bidRoomsAndBids, product });

}

exports.acceptBid = async (req, res, next) => {
    try {
        const bidId = req.params.bidId;
        const bid = await Bid.findById(bidId).populate('product').populate('bidRoom').exec();
        const bidroom = bid.bidRoom;
        console.log(bidroom);
        if (!bid) {
            return res.status(404).json({ error: "Bid not found" });
        }
        const productId = bid.product._id;
        const otherBids = await Bid.find({ product: productId });
        await Bid.updateMany({ product: productId, _id: { $ne: bidId }, status: 'pending' }, { $set: { status: 'rejected' } });
        await Bid.findByIdAndUpdate(bidId, { $set: { status: 'accepted' } });
        await Product.findByIdAndUpdate(productId, { $set: { isSold: true, allow_bids:false } });
        bidroom.open=false;
        bidroom.save();
        const cart = new Cart({
            bid: bidId,
            status: 'pending' 
        });
        await cart.save();
        res.status(200).json({ message: "Bid accepted successfully", otherBids });
    } catch (error) {
        console.error("Error accepting bid:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

exports.createBidRoom = async(req, res, next) =>{
    try{
        const productId= req.params.productId;
        const product = await Product.findById(productId);
        product.allow_bids=true
        product.save()

        
        res.status(201).json({ message: 'Product open for bidding' });
    } catch(error){
        console.error("Error in opening for bidding",error);
        res.status(500).json({ error: 'Internal server error' });
    }
}


exports.findBidroom = async (req, res, next) => {
    const userId=req.query.userId;
    const productId=req.query.productId;
    try{
        const bidroom=await BidRoom.findOne({product:productId, open:true});
        if (!bidroom) {
            const product = await Product.findById(productId);
            const newbidRoom = await BidRoom.create({
                product:productId,
                participants: [product.seller]
            })
        };
        const isParticipant = bidroom.participants.includes(userId);
        const bidroomId = bidroom._id;
        return res.json({isParticipant, bidroomId })
    }catch(error){
        console.error("Error finding bidroom", error);
    }
};

exports.fetchBids_roomId = async (req, res, next) => {
    const bidroomId = req.params.bidroomId;
    console.log('bidroomId: ', bidroomId);

    try{
        const bidroom = await BidRoom.findById(bidroomId).populate('product');
        console.log('bidroom.open: ',bidroom.open);
        const open = bidroom.open;
        const closed = bidroom.closed;
        const productname = bidroom.product.name;
        const deletedproduct = bidroom.product.deleted;
        const openig_bid = bidroom.openig_bid;
        console.log(productname)
        const bids = await Bid.find({bidRoom: bidroom._id})
            .populate('customer').populate('product');
        res.status(200).json({bids,productname,open,deletedproduct,closed, openig_bid});
    }catch(error){
        console.log("Error fetching bids", error);
    }
}

exports.fetchBidrooms_user = async(req, res, next) =>{
    const userId = req.params.userId;
    console.log('userId',userId);
    try{
        const bidRooms = await BidRoom.find({ participants: userId })
            .populate('product')
            .sort({ updateAt: -1 })
            .exec();
        console.log('bidRooms: ',bidRooms);
        res.status(200).json({ bidRooms });
    } catch(error){
        console.error('Error fetching bid rooms:', error);
        res.status(500).json({ error: 'Error fetching bid rooms' });
    }
        
}



const getUpcomingBidDays = async() => {
    const today = new Date();
    const upcomingBiddays = [];
    let day_identifier = 1
    let day = 'Sunday'
    let bid_startingTime = 8;
    let bid_closingTime = 22;
    let day_identifiers =  await Settings.findOne()
    
    if (day_identifiers){
        day_identifier = day_identifiers.biddingDay;
        day = day_identifiers.dayInText;
        bid_startingTime=day_identifiers.bid_startingTime;
        bid_closingTime=day_identifiers.bid_closingTime;
    }else{
        day_identifiers = await Settings.create({
            biddingDay: 1,
            dayInText: 'Sunday',
            bid_startingTime: 8,
            bid_closingTime: 22,
        });
    }

    console.log('----------------')
    console.log('day_identifier',day_identifier)
    console.log('dayInText',day)
    console.log('bid_startingTime',bid_startingTime)
    console.log('bid_closingTime',bid_closingTime)

    const currentDate = new Date(today);
    for (let i = 0; i < 6 * 7; i++) {
        if (currentDate.getDay() === day_identifier) {
            const bidDateOnly = new Date(currentDate); 
            bidDateOnly.setHours(0, 0, 0, 0); 
            upcomingBiddays.push(bidDateOnly);
        }
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    const firstFiveBidDays = upcomingBiddays.slice(0, 5);
    return {firstFiveBidDays, day, bid_startingTime, bid_closingTime};
}


exports.BidDays = async(req, res, next)=>{
    try{
        const upcomingBidDays = await getUpcomingBidDays();
        console.log('upcomingBidDays',upcomingBidDays)
        res.json(upcomingBidDays);
    }catch(error){
        console.error('Error geetting days', error)
        res.status(500).json({ error: 'Error getting upcoming bid days' });
    }
}


const openandclosebidroom = async() =>{
    try{
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        currentDate.setHours(0, 0, 0, 0);
        currentDate.setDate(currentDate.getDate() + 1);

        let bid_startingTime = 8;
        let bid_closingTime = 22;
        const setting = await Settings.findOne()
        bid_startingTime = setting.bid_startingTime
        bid_closingTime = setting.bid_closingTime
        console.log(bid_startingTime,bid_closingTime)
        const bbb = await BidRoom.find().populate('product');
        for (const b of bbb){
            console.log('b.product',b.product.isSold)
        }
        const br = await BidRoom.find({open:false})
        
        console.log('currentHour: ',currentHour);
        for (const b of br){
            
            const biddingDateMs = b.bidding_date.getTime();
            const currentDateMs = currentDate.getTime();
            if (biddingDateMs === currentDateMs) {
                if (b.closed === false){
                    if (currentHour >= bid_startingTime){
                        b.open=true;
                        b.save();
            }}}}

        const br_op = await BidRoom.find({open:true}).populate('product');;
        for (const b of br_op){
            if (b.closed === false){
                const biddingDateMs = b.bidding_date.getTime();
                const currentDateMs = currentDate.getTime();
                if (biddingDateMs === currentDateMs) {
                    if (currentHour >= bid_closingTime){
                        b.open=false;
                        b.closed=true;
                        
                        await b.save()
                        if (b.product) {
                            const pr = b.product
                            pr.isSold = true;
                            pr.allow_bids = false;
                            await pr.save(); 
                        } else {
                            console.log('Product not found for BidRoom:', b._id);
                        }
                        console.log('bidroom is trying to close')
                        try{
                            const bids = await Bid.find({bidRoom:b._id})
                            console.log('bids.length',bids.length)
                            if (bids.length > 0){
                                let h_bid = 0
                                for (const bid of bids){
                                    console.log(bid.amount)
                                    if (bid.amount > h_bid){
                                        h_bid=bid.amount;
                                        bid.status='rejected';
                                        bid.save();

                                    }
                                }
                                console.log('h_bid',h_bid);
                                const h_bidd = bids.find(bid => bid.amount === h_bid);
                                
                                h_bidd.status='accepted'
                                console.log(h_bidd)
                                await h_bidd.save()
                            }else{
                                console.log('no bids')
                            }

                                
                        }catch(error){
                            console.log("error finding biggest bid",error)
                        }
                        
                        
        }}}}

        const br_cl = await BidRoom.find({closed:false});
        for (const b of br_cl){
            const biddingDateMs = b.bidding_date.getTime();
            const currentDateMs = currentDate.getTime();
            if (biddingDateMs < currentDateMs) {
                b.closed=true;
                console.log('trying to close')
                b.save();
                console.log('bidroom is trying to close')
                        try{
                            const bids = await Bid.find({bidRoom:b._id})
                            console.log('bids.length',bids.length)
                            if (bids.length > 0){
                                let h_bid = 0
                                for (const bid of bids){
                                    console.log(bid.amount)
                                    if (bid.amount > h_bid){
                                        h_bid=bid.amount;
                                        bid.status='rejected';
                                        bid.save();
                                    }
                                }
                                console.log('h_bid',h_bid);
                                const h_bidd = bids.find(bid => bid.amount === h_bid);
                                
                                h_bidd.status='accepted'
                                console.log(h_bidd)
                                h_bidd.save()
                            }else{
                                console.log('no bids')
                            }

                                
                        }catch(error){
                            console.log("error finding biggest bid",error)
                        }
        }}
        
    }catch(error){
        console.error('Error in closing', error)
    }
}




exports.getLivebid = async (req, res, next) => {

    try {
        openandclosebidroom();
        const upcomingBiddays = await getUpcomingBidDays();

        const products = await Product.find({ allow_bids: true });
        const productIds = products.map(product => product._id);
        const currentDate = new Date();
        const currentDayOfWeek = currentDate.getDay();
        const currentHour = currentDate.getHours();

        // const bidrooms = await BidRoom.find({ bidding_date: { $gte: currentDate } }).populate('product')
        const bidrooms = await BidRoom.find({ bidding_date: { $gte: currentDate } })
            .populate({
                path: 'product',
                populate: {
                    path: 'seller',
                    select: 'username' 
                }
            });
        // console.log(bidrooms)
        // console.log('allBidRooms',allBidRooms)
        res.status(200).json({bidrooms, upcomingBiddays});
        
    } catch (error) {
        console.log("Error finding bids", error);
        res.status(500).json({ error: 'Error fetching bid rooms' });
    }
};

