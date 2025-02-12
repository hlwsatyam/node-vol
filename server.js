const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require('multer');
const nodemailer = require('nodemailer');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());


const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

function randomNumber() {
  const prefix = "VOL";
  const year = new Date().getFullYear();
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // 8-digit random number

  return `${prefix}-${year}-${randomNumber}`;
}
function generateUniqueValue() {
  
  const randomNumber = Math.floor(10000000 + Math.random() * 90000000); // 8-digit random number

  return randomNumber;
}

app.use('/uploads', express.static('uploads'));
// Connect to MongoDB
mongoose.connect("mongodb+srv://satyampandit021:20172522@rvbmhotelbooking.9hfzkrx.mongodb.net/volbo?retryWrites=true&w=majority", {

})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Define Schema and Model

const LeadSchema = new mongoose.Schema({
  username: String,
  email: String,
  mobile: String,
  pincode: String,
  state: String,
  district: String,
  selectedPostOfficeList:Array,
  approval_fees: String,
  agreementFees: String,
  securityMoney: String,
  father_name: String,
  address: String,
  photo: String,
  aadhar: String,
  pan: String,
  applicationNumber: String,
  documentNumber: String,
  account_number: String,
  ifsc: String,
  branch: String,
  holder_name: String,
  bank_name:String,
  block: {
    type: Boolean,
    default: false
  }
},{
  timestamps: true
});
const Lead = mongoose.model('Lead', LeadSchema);
const proposalSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  pincode: String,
  state: String,
  district: String,
  post_offices:Array,
},{
  timestamps: true
});
const proposal = mongoose.model('proposal', proposalSchema);
const bankSchema = new mongoose.Schema({
bank_name: String,
  account_number: String,
  ifsc: String,
  branch: String,
  holder_name: String,

},{
  timestamps: true
});
const bank = mongoose.model('bank', bankSchema);
 

const FranchiseSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    contact_number: {
        type: String,
        required: true,
        trim: true
    },
    pin_code: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    Franchise_type: {
        type: String,
        enum: ["Delivery Franchise", "District Franchise Hub"], // Allowed values
        default: "Delivery Franchise"
    },
    state: {
        type: String,
        default: "SelectState"
    },
    district: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true }); // Adds createdAt & updatedAt

const Franchise = mongoose.model("Franchise", FranchiseSchema);
app.get('/', async (req, res) => {
  res.send('ffff')
})
// Create Lead Route
app.post('/create-lead', upload.fields([
  { name: 'photo', maxCount: 1 },

]), async (req, res) => {
console.log(req.body.selectedPostOfficeList.split(',')
.map(postOffice => postOffice.trim().toLowerCase()))
  try {
    if (req.body.id) {
      const lead = await Lead.findByIdAndUpdate(req.body.id, {
        username: req.body.username,
        email: req.body.email,
        //applicationNumber:Math.random().toString(36).substring(7),
        // documentNumber:Math.random().toString(36).substring(7),
        mobile: req.body.mobile,
        pincode: req.body.pincode,
        state: req.body.state,
        district: req.body.district,
        selectedPostOfficeList: req.body.selectedPostOfficeList,
        approval_fees: req.body.approval_fees,
        agreementFees: req.body.agreementFees,
        securityMoney: req.body.securityMoney,
        father_name: req.body.father_name,
        address: req.body.address,
        // photo: req.files['photo'][0].path,
        aadhar: req.body.aadhar,
        pan: req.body.pan,
        account_number: req.body.account_number,
        ifsc: req.body.ifsc,
        branch: req.body.branch,
        holder_name: req.body.holder_name,
        bank_name: req.body.bank_name
      })
    }
    const newLead = new Lead({
      username: req.body.username,
      email: req.body.email,
      applicationNumber: generateUniqueValue(),
      documentNumber: randomNumber(),
      mobile: req.body.mobile,
      pincode: req.body.pincode,
      district: req.body.district,
      selectedPostOfficeList: req.body.selectedPostOfficeList,
      state: req.body.state,
      approval_fees: req.body.approval_fees,
      agreementFees: req.body.agreementFees,
      securityMoney: req.body.securityMoney,
      father_name: req.body.father_name,
      address: req.body.address,
      photo: req.files['photo'][0].path,
      aadhar: req.body.aadhar,
      pan: req.body.pan,
      account_number: req.body.account_number,
      account_number: req.body.account_number,
      ifsc: req.body.ifsc,
      branch: req.body.branch,
      holder_name: req.body.holder_name,
      bank_name: req.body.bank_name
    });

    await newLead.save();
    res.json({ message: 'Lead created successfully!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating lead', error });
  }
});
app.post('/franchise', async (req, res) => {
 console.log(req.body)
  try {
   
    const newLead = new Franchise( req.body);

    await newLead.save();
    res.json({ message: 'Lead created successfully!' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating lead', error });
  }
});

app.post('/create-bank', async (req, res) => {
  try {
    const { account_number, ifsc, branch, bank_name, holder_name } = req.body;

    // Find the bank by account_number and update or create a new document
    const updatedBank = await bank.findOneAndUpdate(
      { account_number }, // Find by account_number
      { 
        ifsc, 
        branch, 
        bank_name, 
        holder_name 
      },
      { 
        new: true, // Return the updated document
        upsert: true, // Create a new document if none is found
      }
    );

    res.json({ message: 'Bank details updated or created successfully!', bank: updatedBank });
  } catch (error) {
    res.status(500).json({ message: 'Error creating or updating bank details', error });
  }
});

app.get('/users', async (req, res) => {
  try {
    const leads = await Lead.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leads', error });
  }
})
app.get('/proposals', async (req, res) => {
  try {
    const leads = await proposal.find();
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving leads', error });
  }
})
 
app.get('/getfranch', async (req, res) => {
  try {
    // Assuming `created_at` is the field that stores the timestamp of insertion
    const lastBank = await Franchise.find().sort({ created_at: 1 });
    
    if (!lastBank) {
      return res.status(404).json({ message: 'No banks found' });
    }
    
    res.json(lastBank);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving last added bank', error });
  }
});
app.get('/bank', async (req, res) => {
  try {
    // Assuming `created_at` is the field that stores the timestamp of insertion
    const lastBank = await bank.findOne().sort({ created_at: 1 });
    
    if (!lastBank) {
      return res.status(404).json({ message: 'No banks found' });
    }
    
    res.json(lastBank);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving last added bank', error });
  }
});


// Fetch User by ID
app.get('/user/:id', async (req, res) => {
  try {
     
    const user = await Lead.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.get('/userFromPDF/:id', async (req, res) => {
  try {
    const user = await Lead.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Find the last added bank (assuming 'createdAt' field exists)
    const bankData = await bank.findOne().sort({ createdAt: -1 });

    if (!bankData) return res.status(404).json({ message: 'Bank details not found' });

    res.json({ ...user.toObject(), ...bankData.toObject() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.get('/user/block/:id', async (req, res) => {
  try {
    const user = await Lead.findByIdAndUpdate(req.params.id, {
      block: true
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.get('/user/deleteButton/:id', async (req, res) => {
  try {
    const user = await Lead.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.delete('/proposals/:id', async (req, res) => {
  try {
    const user = await proposal.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.get('/user/step1WelcomeMAil/:id', async (req, res) => {
 
  try {
    const user = await Lead.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await sendMail(user);
    res.json(user);
  } catch (error) {
      
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.get('/user/login/:doc/:mobile', async (req, res) => {
 console.log(req.params)
  try {
    const user = await Lead.findOne({ documentNumber: req.params.doc, mobile: req.params.mobile });
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user);
  } catch (error) {
   
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});
app.post('/create-proposal', async (req, res) => {
  try {
//  console.log(req.body)
 const newLead = new proposal(req.body);
    await newLead.save();
    await sendProposalMail(req.body);
    
    res.json( { message: 'New Proposal created successfully!'});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching user data', error });
  } 
});
app.post('/user/contactus', async (req, res) => {
  try {
 
    await sendMailToEmail(req.body);
    res.json( { message: 'Create proposal'});
  } catch (error) {
   
    res.status(500).json({ message: 'Error fetching user data', error });
  }
});



const sendMailToEmail = async (user) => {
  const transporter = nodemailer.createTransport({
    host: "mail.valmodelivery.com",
    port: 465, // Secure SSL/TLS SMTP Port
    secure: true, // SSL/TLS
    auth: {
      user: "hello@valmodelivery.com",
      pass: "sanjay@9523" // Replace with actual email password
    }
  });

  const mailOptions = {
    from: '"Valmo Logistics" <hello@valmodelivery.com>',
    to: "usercontact@valmodelivery.com",
    subject: "New User Contacted Via Contact Us Form",
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>
      <p><strong>Message:</strong></p>
      <p>${user.message}</p>
      <br>
      <p>Sent from valmodelivery.com</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully to", user.email);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};


const sendMail = async (user) => {
  const transporter = nodemailer.createTransport({
    host: "mail.valmodelivery.com",
    port: 465, // Secure SSL/TLS SMTP Port
    secure: true, // SSL/TLS
    auth: {
      user: "hello@valmodelivery.com",
      pass: "sanjay@9523" // Replace with actual email password
    }
  });

  const mailOptions = {
    from: '"Valmo Logistics" <hello@valmodelivery.com>',
    to: user.email,
    subject: "Your Application Has Been Approved – Partnership Opportunity with Valmo Logistics",
    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
              <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px;">
                  <h2 style="text-align: center; color: #333;">Greetings from Valmo!</h2>
                  <p>Dear <strong>${user.username}</strong>,</p>
                  <p>We are India's most reliable and cost-effective logistics service provider, committed to streamlining the delivery process.</p>

                  <h3>Why Partner with Valmo?</h3>
                  <ul>
                      <li>✔ 9+ lakh orders shipped per day</li>
                      <li>✔ 30,000+ delivery executives</li>
                      <li>✔ 3,000+ partners</li>
                      <li>✔ 6,000+ PIN codes covered</li>
                  </ul>

                  <h3>Franchise Opportunities</h3>
                  <p>We invite you to join us as a Delivery Partner or District Franchisee:</p>
                  <ul>
                      <li>✅ Profit Margin: 25-30% of total revenue</li>
                      <li>✅ Annual Profit Potential: ₹10-15 lakh per annum</li>
                  </ul>

                  <h3>Application Details</h3>
                  <p><strong>Application No.:</strong> ${user.applicationNumber}</p>
                  <p><strong>Application Status:</strong> Approved</p>
                  
 <ul><strong>Allocated Location:</strong> 
        ${
          user.selectedPostOfficeList.map((post_office) => `<li>${post_office}</li>`)
        }
          
        </ul>
                  <h3>Recipient Details</h3>
                  <p><strong>Name:</strong> ${user.username}</p>
                  <p><strong>Address:</strong> ${user.address}</p>
                  <p><strong>Mobile No.:</strong> ${user.mobile}</p>
                  <p><strong>Email ID:</strong> ${user.email}</p>

                  <h3>Login Details</h3>
                  <p><strong>Login ID/Application No.:</strong> ${user.applicationNumber}</p>
                  <p><strong>Password:</strong> ${user.mobile}</p>

                  <p>For more details, visit our website:</p>
                  <p><a href="https://www.valmodelivery.com" style="color: blue;">www.valmodelivery.com</a></p>

                  <p style="text-align: center; font-weight: bold;">Best Regards, <br> Valmo Logistics Franchisee Development Team</p>
              </div>
          </div>
      `
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully to", user.email);
};
const sendProposalMail = async (user) => {
  const transporter = nodemailer.createTransport({
    host: "mail.valmodelivery.com",
    port: 465, // Secure SSL/TLS SMTP Port
    secure: true, // SSL/TLS
    auth: {
      user: "hello@valmodelivery.com",
      pass: "sanjay@9523" // Replace with actual email password
    }
  });

  const mailOptions = {
    from: '"Valmo Logistics" <hello@valmodelivery.com>',
    to: user.email,
    subject: "Proposal for Valmo Logistics Partnership – Preferred Location and PIN Code Availability",
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; padding: 20px;">
        <h2 style="color: #1E88E5;">Dear  ${user.name},</h2>
        <p>Greetings from Valmo!</p>
        <p>We are India’s most reliable and cost-effective logistics service partner, committed to streamlining logistics and ensuring a smooth and efficient delivery experience at the lowest cost.</p>
        <p>We are pleased to inform you that your preferred PIN code and location are available for a Valmo franchise partnership. This is a great opportunity to collaborate with one of India's fastest-growing logistics companies.</p>

        <h3 style="color: #1E88E5;">Why Partner with Valmo?</h3>
        <ul style="list-style-type: none; padding-left: 0;">
          <li>9+ lakh orders shipped daily</li>
          <li>30,000+ delivery executives</li>
          <li>3,000+ partners</li>
          <li>6,000+ PIN codes served</li>
        </ul>

        <h3 style="color: #1E88E5;">Preferred Location & PIN Code Availability:</h3>
        <p><strong>PIN Code Availability:</strong> ${user.pincode} </p>
        <p><strong>Location Availability:</strong></p>
        <ul>
        ${
          user.post_offices.map((post_office) => `<li>${post_office}</li>`)
        }
          
        </ul>

        <h3 style="color: #1E88E5;">Franchise Opportunities & Earnings</h3>
        <p><strong>Delivery Franchise:</strong> ₹30 per product (100 products daily commitment)</p>
        <p><strong>District Franchise:</strong> ₹20 per product (1,000 products daily commitment)</p>
        <p><strong>Profit Margin:</strong> 25-30%</p>
        <p><strong>Annual Profit Potential:</strong> ₹10-15 lakh per annum</p>

        <h3 style="color: #1E88E5;">Company Support Includes:</h3>
        <ul>
          <li>Comprehensive training for franchise owners & staff</li>
          <li>Advanced software & order tracking tools</li>
          <li>Barcode scanner, fingerprint scanner</li>
          <li>Marketing materials (banners, posters, etc.)</li>
          <li>Doorstep stock delivery</li>
          <li>Vehicles for shipment & delivery</li>
          <li>Loading & unloading support</li>
        </ul>

        <h3 style="color: #1E88E5;">Company Benefits for Franchise Partners:</h3>
        <ul>
          <li>Company pays salary for 3 employees</li>
          <li>50% rent & electricity bill covered</li>
          <li>Company-designed interiors</li>
          <li>All necessary products & equipment provided</li>
          <li>Space requirement: 200-500 sq. ft.</li>
        </ul>

        <h3 style="color: #1E88E5;">Investment Details</h3>
        <p><strong>Registration Fee:</strong> ₹18,600</p>
        <p><strong>Security Money:</strong> 90% refundable after the agreement. Additionally, earn a 7.5% interest on the security deposit. Here's how you can calculate the interest:</p>
        <p><strong>Interest Calculation:</strong> ₹2,00,000 × 7.5% × 1 year = ₹15,000 per annum</p>
        <p><strong>One-time Setup Fee:</strong> ₹2,00,000 (lifetime investment)</p>

        <h3 style="color: #1E88E5;">Required Documents:</h3>
        <ul>
          <li>Aadhar card</li>
          <li>PAN card</li>
          <li>Education certificate</li>
          <li>Passport-size photo</li>
        </ul>

        <p>We believe this partnership will be highly beneficial, and we are excited to collaborate with you.</p>
        <p>For further discussions, please feel free to contact:</p>
        <p>📧 hello@valmodelivery.com</p>
        <p>🌐 <a href="https://www.valmodelivery.com" style="color: #1E88E5;">www.valmodelivery.com</a></p>

        <h4 style="color: #1E88E5;">Office Address:</h4>
        <p>3rd Floor, Wing-E, Helios Business Park, Kadubeesanahalli Village, Varthur Hobli, Outer Ring Road, Bellandur, Bangalore South, Karnataka, India, 560103</p>

        <p style="font-size: 0.9em; color: #888;">Looking forward to your response.</p>

        <hr style="border: 1px solid #ccc; margin-top: 20px;" />

        <p style="font-size: 0.8em; color: #888;">This email and any attachments may contain confidential and proprietary information intended solely for the recipient(s). If you are not the intended recipient, please notify the sender immediately and delete this email. Any unauthorized use, disclosure, or distribution of this email is prohibited. Valmo is not liable for any damages caused by viruses or other malware transmitted via email.</p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
  console.log("Email sent successfully to", user.email);
};














app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Admin not found" });
  }
  if (password === "admin123" && username == "admin123") {
    return res.status(200).json({ message: "Login successful" });
  }

  return res.status(400).json({ message: "Admin not found" });
});














// Start Server
const PORT =process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
