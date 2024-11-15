import { useState, useEffect } from "react";
import { z } from "zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Form from "./forms/Form";
import Card from "./Card";

type FormData = z.infer<typeof formSchema>;

function App() {
  const loadFromLocalStorage = (key: string) => {
    try {
      const savedData = localStorage.getItem(key);
      return savedData ? JSON.parse(savedData) : [];
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const [unclaimedCards, setUnclaimedCards] = useState<FormData[]>(() =>
    loadFromLocalStorage("unclaimedCards")
  );
  const [firstContactCards, setFirstContactCards] = useState<FormData[]>(() =>
    loadFromLocalStorage("firstContactCards")
  );
  const [preparingWorkOfferCards, setPreparingWorkOfferCards] = useState<FormData[]>(() =>
    loadFromLocalStorage("preparingWorkOfferCards")
  );
  const [sendToTherapistsCards, setSendToTherapistsCards] = useState<FormData[]>(() =>
    loadFromLocalStorage("sendToTherapistsCards")
  );

  useEffect(() => {
    const cardsData = {
      unclaimedCards,
      firstContactCards,
      preparingWorkOfferCards,
      sendToTherapistsCards,
    };

    try {
      Object.keys(cardsData).forEach((key) => {
        localStorage.setItem(key, JSON.stringify(cardsData[key as keyof typeof cardsData]));
      });
    } catch (error) {
      console.error(`Error saving data to localStorage: ${error}`);
    }
  }, [unclaimedCards, firstContactCards, preparingWorkOfferCards, sendToTherapistsCards]);

  const handleFormSubmit = (data: FormData) => {
    setUnclaimedCards([...unclaimedCards, data]);
    toast.success("New card added!");
  };

  const confirmAction = (message: string, action: () => void) => {
    if (window.confirm(message)) {
      action();
    }
  };

  const DeleteCard = (index: number, title: string, name: string, column: string) => {
    confirmAction(`Are you sure you want to delete ${title} ${name}?`, () => {
      switch (column) {
        case "unclaimed":
          setUnclaimedCards((prevCards) => prevCards.filter((_, i) => i !== index));
          break;
        case "firstContact":
          setFirstContactCards((prevCards) => prevCards.filter((_, i) => i !== index));
          break;
        case "preparingWorkOffer":
          setPreparingWorkOfferCards((prevCards) => prevCards.filter((_, i) => i !== index));
          break;
        case "sendToTherapists":
          setSendToTherapistsCards((prevCards) => prevCards.filter((_, i) => i !== index));
          break;
        default:
          break;
      }
      toast.success(`${title} ${name} profile deleted`);
    });
  };

  const EditCard = (index: number, updatedCard: FormData, column: string) => {
    const updateColumn = (cards: FormData[], index: number, updatedCard: FormData) => {
      const updatedCards = [...cards];
      updatedCards[index] = updatedCard;
      return updatedCards;
    };

    switch (column) {
      case "unclaimed":
        setUnclaimedCards((prevCards) => updateColumn(prevCards, index, updatedCard));
        break;
      case "firstContact":
        setFirstContactCards((prevCards) => updateColumn(prevCards, index, updatedCard));
        break;
      case "preparingWorkOffer":
        setPreparingWorkOfferCards((prevCards) => updateColumn(prevCards, index, updatedCard));
        break;
      case "sendToTherapists":
        setSendToTherapistsCards((prevCards) => updateColumn(prevCards, index, updatedCard));
        break;
      default:
        break;
    }
    toast.success("Card updated successfully");
  };

  const moveCard = (card: FormData, fromColumn: string, toColumn: string) => {
    const removeCard = (cards: FormData[], card: FormData) => cards.filter((c) => c !== card);
    const addCard = (cards: FormData[], card: FormData) => [...cards, card];

    switch (fromColumn) {
      case "unclaimed":
        setUnclaimedCards((prevCards) => removeCard(prevCards, card));
        break;
      case "firstContact":
        setFirstContactCards((prevCards) => removeCard(prevCards, card));
        break;
      case "preparingWorkOffer":
        setPreparingWorkOfferCards((prevCards) => removeCard(prevCards, card));
        break;
      case "sendToTherapists":
        setSendToTherapistsCards((prevCards) => removeCard(prevCards, card));
        break;
      default:
        break;
    }

    switch (toColumn) {
      case "unclaimed":
        setUnclaimedCards((prevCards) => addCard(prevCards, card));
        break;
      case "firstContact":
        setFirstContactCards((prevCards) => addCard(prevCards, card));
        break;
      case "preparingWorkOffer":
        setPreparingWorkOfferCards((prevCards) => addCard(prevCards, card));
        break;
      case "sendToTherapists":
        setSendToTherapistsCards((prevCards) => addCard(prevCards, card));
        break;
      default:
        break;
    }
    toast.success(`Card moved successfully to ${toColumn}`);
  };

  return (
    <div className="bg-[#d3e5ed] w-full h-[100vh] p-5">
      <header className="flex flex-col items-center justify-center text-2xl text-black mb-8">
        <b>Kanban Board</b>
      </header>

      <div className="flex text-black">
        <Form onSubmit={handleFormSubmit} />

        <div>
          <div className="flex h-full gap-2 text-sm">
            {[
              { title: "Unclaimed", cards: unclaimedCards, column: "unclaimed" },
              { title: "First Contact", cards: firstContactCards, column: "firstContact" },
              { title: "Preparing Work Offer", cards: preparingWorkOfferCards, column: "preparingWorkOffer" },
              { title: "Send to Therapists", cards: sendToTherapistsCards, column: "sendToTherapists" }
            ].map(({ title, cards, column }) => (
              <div key={column}>
                <div className="bg-transparent border  border-[#91b0c4] shadow-xl rounded-xl">
                  <div className="flex justify-between px-5 my-3">
                    <b>{title}</b>
                    <b className="bg-slate-100 rounded-xl px-3">{cards.length}</b>
                  </div>
                  <div className="scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-blue-100 overflow-y-scroll h-[30rem] px-2">
                    {cards.length === 0 ? (
                      <p className="text-gray-500">No cards in this column.</p>
                    ) : (
                      cards.map((card, index) => (
                        <Card
                          key={index}
                          {...card}
                          onDelete={() => DeleteCard(index, card.title, card.name, column)}
                          onEdit={(updatedCard) => EditCard(index, updatedCard, column)}
                          onMove={(toColumn) => moveCard(card, column, toColumn)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={2000} />
    </div>
  );
}

export default App;