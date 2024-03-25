import React, { useState } from 'react';

const FaqSection = () => {
  // Array of FAQs
  const faqs = [
    {
    question: "What cryptocurrencies do you accept for investments?",
    answer: "Currently ChainFund only accepts donations in Ethereum, in the Future we will look to expand into multiple cryptocurrencies",
    },

    {
        question: "How do I start a crowdfunding campaign on your platform?",
        answer: "To create a campaign you will need a Metamask Wallet as well as sufficient ETH balance for transaction fees."
    },

    {
        question: "What happens if a campaign is cancelled?",
        answer: "ChainFund, employs a escrow system where funds are kept until campaign completion. Therefore, if a campaign is cancelled before completion users will receive a refund."
    },
    {
    question: "How can investors trust the projects listed on your platform?",
    answer: "Projects are required to post frequent updates, by employing a voting system it ensures that project organizers will need to meet requirements in order to receive their funds."
    },
    // Add more questions as needed
  ];

  // State to manage which dropdown is open
  const [openIndexes, setOpenIndexes] = useState(Array(faqs.length).fill(false));

  // Function to toggle an individual dropdown
  const toggleDropdown = (index: any) => {
    const newOpenIndexes = [...openIndexes];
    newOpenIndexes[index] = !newOpenIndexes[index];
    setOpenIndexes(newOpenIndexes);
  };

  return (
    <section className="text-white">
        <div className="container max-w-7xl px-6 py-10 mx-auto text-center">
            <h1 className="text-5xl font-semibold text-wrap w-20">Frequently Asked Questions</h1>
            <hr className="opacity-20 mt-4 rounded-xl"></hr>
            <div className="mt-12 space-y-8">
            {faqs.map((faq, index) => (
                <div key={index} className="rounded-lg bg-[#301E67] overflow-hidden">
                <button
                    className="flex items-center justify-between w-full p-8 outline-none focus:outline-none"
                    onClick={() => toggleDropdown(index)}
                >
                    <h1 className="font-semibold md:text-xl">{faq.question}</h1>
                    <span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={openIndexes[index] ? "M18 12H6" : "M12 6l-6 6 6 6"} />
                    </svg>
                    </span>
                </button>
                <div
                    className={`transition-height duration-200 ease-in-out ${openIndexes[index] ? 'max-h-96' : 'max-h-0'}`}
                    aria-expanded={openIndexes[index]}
                >
                    <p className="p-8 text-l text-gray-500">{faq.answer}</p>
                </div>
                </div>
          ))}
          </div>
      </div>
    </section>
  );
};

export default FaqSection;
