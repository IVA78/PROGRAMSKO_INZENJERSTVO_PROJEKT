import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../../styles/App.css';
import '../../styles/MyAccount.css';
import '../../styles/views/OrganizerView.css';
import AddEvent from "../AddEvent";

const OrganizerView = (props) => {

   var accessToken = sessionStorage.getItem("accessToken");
   var userData = props.myProp;

   const navigate = useNavigate();

   const [email, setEmail] = useState("");
   const [username, setUserName] = useState("");
   const [password, setPassword] = useState("");
   const [homeAdress, setHomeAdress] = useState("");
   const [message, setMessage] = useState({
      type: "",
      content: ""
   });
   const [membershipAmount, setMembershipAmount] = useState("");
   const [errorInput, setErrorInput] = useState("");

   const [creditCardNumber, setCreditCardNumber] = useState("");
   const [creditCardName, setCreditCardName] = useState("");
   const [creditCardExpirationDate, setCreditCardExpirationDate] = useState('');
   const [creditCardCVC, setCreditCardCVC] = useState("");
   const [PayPalEmail, setPayPalEmail] = useState("");
   const [PayPalPassword, setPayPalPassword] = useState("");

   const validatePassword = () => {
      const inputPayPalPassword = document.getElementById('PayPalPassword');
      
      if (inputPayPalPassword.value === "") {
         setErrorInput("Upišite sve podatke!");
         return false;
      }
      else {
         setErrorInput("");
         return true;
      }
   }

   const validatePayPalEmail = () => {
      const inputPayPayEmail = document.getElementById('PayPalEmail');
      if (!inputPayPayEmail.value.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)) {
         inputPayPayEmail.style.borderColor = "red";
         return false;
      }
      else {
         inputPayPayEmail.style.borderColor = "green";
         return true;
      }
   }

   const handleCardCVCInput = (event) => {
      let inputValue = event.target.value;

      inputValue = inputValue.replace(/\D/g, '');
      setCreditCardCVC(inputValue);
   }

   const handleExpirationDateInput = (event) => {
      let inputValue = event.target.value;

      // Uklonite sve karaktere osim brojeva
      inputValue = inputValue.replace(/\D/g, '');

      // Formatirajte brojeve kao MM/YY
      if (inputValue.length <= 4) {
         let formattedValue = '';
         for (let i = 0; i < inputValue.length; i++) {
            if (i === 2 && inputValue.length > 2) {
               formattedValue += '/'; // Dodajte kosu crtu između MM i YY
            }
            formattedValue += inputValue[i];
         }

         // Postavite formatirani datum u stanje
         setCreditCardExpirationDate(formattedValue);
      }
   };

   const handleCardNumberInput = (event) => {
      let inputValue = event.target.value;

      // Uklonite sve karaktere osim brojeva
      inputValue = inputValue.replace(/\D/g, '');

      // Formatirajte brojeve dok se unose
      let formattedValue = '';
      for (let i = 0; i < inputValue.length; i++) {
         if (i > 0 && i % 4 === 0) {
            formattedValue += ' '; // Dodajte razmak nakon svake grupe od 4 broja
         }
         formattedValue += inputValue[i];
      }

      // Postavite formatirani broj u stanje
      setCreditCardNumber(formattedValue);
   };

   useEffect(() => {
      setEmail(userData.email);
      setUserName(userData.username);
      setHomeAdress(userData.homeAdress || "");
   }, [userData]);

   const Edit = () => {
      var sendButton = document.querySelector(".btn.btn-primary");
      var inputs = document.querySelectorAll(".form-control");
      sendButton.toggleAttribute("hidden");
      inputs.forEach((input) => {
         input.toggleAttribute("disabled");
      })

      setValues();
   }

   const setValues = () => {
      var userNameInput = document.getElementById('userName');
      var emailInput = document.getElementById('email');
      var addressInput = document.getElementById('address');

      userNameInput.value = userData.username;
      emailInput.value = userData.email;
      addressInput.value = userData.homeAdress;

      setUserName(userData.username);
      setEmail(userData.email);
      setHomeAdress(userData.homeAdress);
   }

   const handleEdit = (e) => {
      e.preventDefault();
      combineAndSubmitData();
      Edit();

   }

   const combineAndSubmitData = () => {

      accessToken = sessionStorage.getItem("accessToken");
      // console.log("session1: " + accessToken);

      setShowModalValidation(false);

      const oldEmail = userData.email;
      const oldUserName = userData.username;


      const user = {
         username,
         email,
         homeAdress,
         password
      };

      fetch('/api/data/change', {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken
         },
         body: JSON.stringify(user)
      })
         .then((response) => {
            if (!response.ok) {
               setUserName(oldUserName);
               setEmail(oldEmail);
               setMessage("Pogrešna lozinka");
            }
            else {
               userData.email = email;
               userData.username = username;
               userData.homeAdress = homeAdress;

               const podatci = {
                  username: user.username,
                  password: user.password
               };

               fetch("/api/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(podatci),
               })
                  .then((response) => {
                     if (!response.ok) {
                        throw new Error("No user found");
                     }
                     return response.text();
                  })
                  .then((response) => {
                     sessionStorage.setItem("accessToken", response);
                  })
                  .catch((error) => {
                     console.error("Error fetching data: ", error);
                  });

               setMessage({
                  type: "change",
                  content: "Podatci promijenjeni!"
               });
            }

            setTimeout(() => {
               setShowModalMessage(true);
            }, 500)
         })
   }

   const [showModalAddEvent, setShowModalAddEvent] = useState(false);
   const [showModalDelete, setShowModalDelete] = useState(false);
   const [showModalMessage, setShowModalMessage] = useState(false);
   const [showModalPayMembership, setShowModalPayMembership] = useState(false);
   const [showModalValidation, setShowModalValidation] = useState(false);
   const [showModalPayWithCard, setShowModalPayWithCard] = useState(false);
   const [showModalPayWithPayPal, setShowModalPayWithPayPal] = useState(false);
   const [showModalMembershipPayed, setShowModalMembershipPayed] = useState(false);

   const validation = () => {
      setShowModalValidation(true);
   }

   const closeModalAddEvent = () => {
      setShowModalAddEvent(false);
   };
   const openModalAddEvent = () => {
      setShowModalAddEvent(true);
   }

   const closeModalDelete = () => {
      setShowModalDelete(false);
   }

   const openModalDelete = () => {
      setShowModalDelete(true);
   }

   const closeModalMessage = () => {
      setShowModalMessage(false);
   }
   const openModalMessage = () => {
      setShowModalMessage(true);
   }

   const closeModalPayWithPayPal = () => {
      setShowModalPayWithPayPal(false);
   }
   const openModalPayWithPayPal = () => {
      setPayPalEmail("");
      setPayPalPassword("");
      setErrorInput("");
      setShowModalPayWithPayPal(true);
   }

   const closeModalPayWithCard = () => {
      setShowModalPayWithCard(false);
   }
   const openModalPayWithCard = () => {
      setCreditCardNumber("");
      setCreditCardName("");
      setCreditCardExpirationDate("");
      setCreditCardCVC("");
      setShowModalPayWithCard(true);
   }

   const closeModalMembershipPayed = () => {
      setShowModalMembershipPayed(false);
   }
   const openModalMembershipPayed = () => {
      setShowModalMembershipPayed(true);
   }

   const closeModalPayMembership = () => {
      setShowModalPayMembership(false);
   }
   const openModalPayMembership = () => {
      setShowModalPayMembership(true);
      handleGetMembershipPrice();
   }
   const handleGetMembershipPrice = () => {
      fetch('/api/membership/price', {
         method: "GET",
         headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken
         }
      })
         .then((response) => {
            if (!response.ok) {
               setMessage({
                  type: "error",
                  content: "Nije moguće dohvatiti iznos članarine!"
               })
            }
            else {
               return response.json();
            }
         })
         .then((response) => {
            if (response) {
               setMembershipAmount(response);
               setMessage({
                  type: "get-price",
                  content: "Cijena članarine: " + response + " €"
               })
            }
         })
   }

   const deleteMyProfile = () => {

      fetch('/api/data/deleteMyProfile', {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken
         }
      })
         .then((response) => {
            if (!response.ok) {
               setMessage({
                  type: "delete",
                  content: "Nemoguće izbrisati korisnika!"
               });
            }
            else {
               return response.text();
            }
         })
         .then((response) => {
            setMessage({
               type: "delete",
               content: "Korisnik obrisan!"
            });
         })

      closeModalDelete();
      setTimeout(() => {
         openModalMessage();
      }, 500)
   }

   const handlePayMembership = () => {

      // ako plaćam PayPalom onda se mora provjeriti Email i Password

      if (!validatePayPalEmail()) {
         setErrorInput("Unesite točan format email adrese!");
         return;
      }
      if (!validatePassword()) {
         return;
      }

      fetch('/api/membership', {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
            'Authorization': accessToken
         }
      })
         .then((response) => {
            console.log(response);
            if (!response.ok) {
               setMessage({
                  type: "error",
                  content: "Transakcija nije provedena!"
               })
            }
            else {
               setMessage({
                  type: "membership-payed",
                  content: "Članarina plaćena!"
               })
            }
            openModalMembershipPayed();
            closeModalPayWithCard();
            closeModalPayWithPayPal();
         })
   }



   return (
      <>
         {
            (accessToken !== null) ? // ako je netko prijavljen onda vrati info o korisniku/organizatoru, inače ništa
               <div className="my-account-content">
                  <div className='my-account-content-title-and-text'>
                     <div className='my-account-content-title'>
                        <h1>Pozdrav, {userData.username}!</h1>
                        <h4>{userData.typeOfUser}</h4>
                     </div>
                     <div className='my-account-content-text'>
                        <div className='form'>
                           <div className="form-group">
                              <label htmlFor="userName">Korisničko ime:</label>
                              <input type="text" className="form-control" id="userName" value={username} onChange={(e) => { setUserName(e.target.value) }} disabled></input>
                           </div>

                           <div className="form-group">
                              <label htmlFor="email">E-mail adresa:</label>
                              <input type="email" className="form-control" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} disabled></input>
                           </div>

                           <div className="form-group">
                              <label htmlFor="address">Adresa:</label>
                              <input type="text" className="form-control" id="address" value={homeAdress} onChange={(e) => { setHomeAdress(e.target.value) }} disabled></input>
                           </div>

                           <button className="btn btn-primary" onClick={validation} hidden>Spremi</button>
                        </div>
                     </div>
                  </div>

                  {/* TODO - dodati funkcionalnost buttona! */}
                  <div className="edit-content">
                     <button className="btn btn-primary" id="edit-buttons" onClick={Edit}>Uredi profil</button>
                     <button className="btn btn-primary" id="edit-buttons" onClick={openModalAddEvent}>Dodaj događanje</button>
                     <button className="btn btn-primary" id="edit-buttons" onClick={openModalPayMembership}>Plati članarinu</button>
                     <button className="btn btn-primary" id="edit-buttons" onClick={openModalDelete}>Obriši moj račun</button>
                  </div>

                  {/* Modal */}
                  {showModalValidation && (
                     <div className="background">
                        <div className="window">
                           <div>Unesi lozinku</div>
                           <label htmlFor='password'>Lozinka:</label>
                           <input type='password' className='form-control' id='password' onChange={(e) => { setPassword(e.target.value); }}></input>
                           <button type="submit" className='btn btn-primary' onClick={handleEdit}>Provjeri</button>
                        </div>
                     </div>
                  )}

                  {showModalAddEvent && (
                     navigate("/add-event")
                  )}

                  {/* Modal */}
                  {showModalPayMembership && (
                     <div className="background">
                        <div className="window">
                           <span className='exit' onClick={closeModalPayMembership}>&times;</span>
                           <div>{message.content}</div>
                           {message.type !== "error" ?
                              <>
                                 <div>Odaberi način plaćanja:</div>
                                 <div>
                                    <button className='btn btn-primary' onClick={openModalPayWithCard}>Karticom</button>
                                    <button className='btn btn-primary' onClick={openModalPayWithPayPal}>PayPalom</button>
                                 </div>
                              </> : <></>}
                        </div>
                     </div>
                  )}

                  {/* Modal */}
                  {showModalPayWithCard && (
                     <div className="background">
                        <div className="window-payment">
                           <span className='exit' onClick={closeModalPayWithCard}>&times;</span>
                           <div>Iznos: {membershipAmount} €</div>
                           <div>Unesi podatke o kartici:</div>
                           <div className='form-group'>
                              <label htmlFor='cardNumber'>Broj kreditne kartice:</label>
                              <input
                                 type='text'
                                 className='form-control'
                                 id='cardNumber'
                                 value={creditCardNumber}
                                 onChange={handleCardNumberInput}
                                 placeholder='0000 0000 0000 0000'
                                 maxLength={19}
                              />
                           </div>
                           <div className='form-group'>
                              <label htmlFor='cardName'>Ime nositelja kartice:</label>
                              <input type='text'
                                 className='form-control'
                                 id='cardName'
                                 value={creditCardName}
                                 placeholder='Pero Perić'
                                 onChange={(e) => { setCreditCardName(e.target.value) }} />
                           </div>
                           <div className='form-group'>
                              <label htmlFor='cardExpirationDate'>Datum isteka:</label>
                              <input
                                 type="text"
                                 className='form-control'
                                 id='cardExpirationDate'
                                 value={creditCardExpirationDate}
                                 onChange={handleExpirationDateInput}
                                 placeholder="MM/YY"
                                 maxLength={5}
                              />
                           </div>
                           <div className='form-group'>
                              <label htmlFor='cardCVC'>CVC:</label>
                              <input type='text'
                                 className='form-control'
                                 id='cardCVC'
                                 value={creditCardCVC}
                                 placeholder='000'
                                 onChange={handleCardCVCInput}
                                 maxLength={3}
                              />
                           </div>

                           <button type='submit' className='btn btn-primary' onClick={handlePayMembership}>Plati</button>

                        </div>
                     </div>
                  )}

                  {/* Modal */}
                  {showModalPayWithPayPal && (
                     <div className="background">
                        <div className="window-payment">
                           <span className='exit' onClick={closeModalPayWithPayPal}>&times;</span>
                           <div>Unesi podatke o PayPalu:</div>
                           <div className='error-input'>{ errorInput }</div>
                           <div className='form-group'>
                              <label htmlFor='PayPalEmail'>Email:</label>
                              <input
                                 type="email"
                                 className="form-control"
                                 id="PayPalEmail"
                                 value={PayPalEmail}
                                 onChange={(e) => {
                                    setErrorInput("");
                                    setPayPalEmail(e.target.value);
                                    validatePayPalEmail();
                                 }}
                              />
                              <label htmlFor='PayPalPassword'>Password:</label>
                              <input
                                 type='password'
                                 className='form-control'
                                 id='PayPalPassword'
                                 value={PayPalPassword}
                                 onChange={(e) => {
                                    setErrorInput("");
                                    setPayPalPassword(e.target.value);
                                 }}></input>
                           </div>
                           <button type='submit' className='btn btn-primary' onClick={handlePayMembership}>Plati</button>
                        </div>
                     </div>
                  )}

                  {/* Modal */}
                  {showModalMembershipPayed && (
                     <div className="background">
                        <div className="window-payment">
                           <div>{message.content}</div>
                           {message.type !== "error" ?
                              <div>
                                 <button className='btn btn-primary' onClick={() => {
                                    closeModalMembershipPayed();
                                    setMessage({
                                       type: "",
                                       content: ""
                                    })
                                    closeModalPayMembership();
                                 }}>Zatvori</button>
                              </div> :
                              <div>
                                 <button className='btn btn-primary' onClick={() => {
                                    closeModalMembershipPayed();
                                    setMessage({
                                       type: "get-price",
                                       content: "Cijena članarine: " + membershipAmount + " €"
                                    })
                                 }}>Pokušaj ponovno</button>
                                 <button className='btn btn-primary' onClick={() => {
                                    closeModalMembershipPayed();
                                    setMessage({
                                       type: "",
                                       content: ""
                                    })
                                    closeModalPayMembership();
                                 }}>Odustani</button>
                              </div>}
                        </div>
                     </div>
                  )}

                  {/* Modal */}
                  {showModalDelete && (
                     <div className="background">
                        <div className="window">
                           <span className='exit' onClick={closeModalDelete}>&times;</span>
                           <div>Jesi siguran da želiš obrisati račun?</div>
                           <div>
                              <button className="btn btn-primary" id="yes-button" onClick={deleteMyProfile}>Da</button>
                              <button className="btn btn-primary" id="no-button" onClick={closeModalDelete}>Ne</button>
                           </div>
                        </div>
                     </div>
                  )}

                  {/* Modal */}
                  {showModalMessage && (
                     <div className="background">
                        <div className="window">
                           <div>{message.content}</div>
                           <button className='btn btn-primary' onClick={() => {
                              closeModalMessage();

                              if (message.type === "delete") {
                                 sessionStorage.removeItem("accessToken");
                                 navigate('/home');
                              }
                              window.location.reload();
                           }}>Zatvori</button>
                        </div>
                     </div>
                  )}

               </div> : ""
         }

      </>
   );
}

export default OrganizerView;