export interface EnglishLesson {
  id: string
  title: string
  category: string
  summary: string
  introduction: string
  sections: {
    heading: string
    body: string
    examples: { original: string; explanation: string }[]
  }[]
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  answerIndex: number
  explanation: string
}

export interface DialogueStep {
  id: string
  botUtterance: string
  feedback: string
  userChoices: { text: string; nextStepId: string }[]
}

export interface RoleplayScenario {
  id: string
  title: string
  description: string
  iconName: string
  startStepId: string
  steps: Record<string, DialogueStep>
}

export const ENGLISH_LESSONS: EnglishLesson[] = [
  {
    id: "tenses",
    title: "Mastering English Tenses",
    category: "Grammar & Structure",
    summary: "Understand how to construct past, present, and future sentences with correct auxiliary verbs.",
    introduction: "Tenses show the time when an action takes place. English has three main tenses: Present, Past, and Future. Each tense is further divided into Simple, Continuous, Perfect, and Perfect Continuous aspects.",
    sections: [
      {
        heading: "1. Present Simple vs. Present Continuous",
        body: "Use Present Simple for habits, regular routines, or universal facts. Use Present Continuous for actions happening exactly at this moment.",
        examples: [
          { original: "I write code every day.", explanation: "Habit/Routine (Present Simple)" },
          { original: "I am writing code right now.", explanation: "Happening now (Present Continuous)" }
        ]
      },
      {
        heading: "2. Past Simple vs. Present Perfect",
        body: "Use Past Simple when referring to a completed action at a specific time in the past. Use Present Perfect for actions that happened in the past but have relevance or impact on the present, or when the exact time is not important.",
        examples: [
          { original: "I visited London in 2024.", explanation: "Completed action in the past (Past Simple)" },
          { original: "I have visited London three times.", explanation: "Life experience up to now (Present Perfect)" }
        ]
      },
      {
        heading: "3. Future Simple & 'Going To'",
        body: "Use 'Will' for spontaneous decisions or general predictions. Use 'Going to' for pre-arranged plans or intentions.",
        examples: [
          { original: "Wait, I will help you with that error.", explanation: "Spontaneous decision (Future Simple)" },
          { original: "I am going to study algorithms tonight.", explanation: "Pre-arranged plan (Going to)" }
        ]
      }
    ]
  },
  {
    id: "vocabulary",
    title: "Idioms & Phrasal Verbs",
    category: "Vocabulary Expansion",
    summary: "Elevate your spoken and written English by using common professional idioms and phrasal verbs.",
    introduction: "Phrasal verbs (verb + preposition) and idioms are expressions with meanings that cannot be directly deduced from their individual words. They are key to sounding fluent and natural.",
    sections: [
      {
        heading: "1. Common Workplace Phrasal Verbs",
        body: "These are verbs commonly used in meetings, team discussions, and emails.",
        examples: [
          { original: "Let's call off the meeting.", explanation: "'Call off' means to cancel." },
          { original: "We need to catch up on the design changes.", explanation: "'Catch up on' means to get up-to-date on." }
        ]
      },
      {
        heading: "2. Idioms for Collaboration & Tech",
        body: "Express complex situations concisely using standard idioms.",
        examples: [
          { original: "We are all on the same page.", explanation: "'On the same page' means to agree or understand each other." },
          { original: "Let's touch base next week.", explanation: "'Touch base' means to contact or check in briefly." },
          { original: "It's not rocket science.", explanation: "Means it is not very difficult to understand." }
        ]
      }
    ]
  },
  {
    id: "pronunciation",
    title: "Pronunciation & Word Stress",
    category: "Speaking & Pronunciation",
    summary: "Learn how word stress, intonation, and silent letters shape clear English communication.",
    introduction: "In English, we do not speak all syllables with the same force. Correct pronunciation depends heavily on putting stress on the correct syllable, and using rising or falling intonation to convey intent.",
    sections: [
      {
        heading: "1. Two-Syllable Nouns vs. Verbs",
        body: "Many two-syllable words in English change meaning based on stress. Nouns stress the first syllable, while verbs stress the second.",
        examples: [
          { original: "PRES-ent (Noun)", explanation: "A gift or current moment (Stress on PRES)." },
          { original: "pre-SENT (Verb)", explanation: "To show or give a speech (Stress on SENT)." }
        ]
      },
      {
        heading: "2. Silent Letters and Intonation",
        body: "Be aware of silent letters like the 'b' in 'doubt' or the 'k' in 'knowledge'. Intonation is also important: rise at the end of yes/no questions, and fall at the end of statements.",
        examples: [
          { original: "Could you help me? (Rising tone)", explanation: "Signals a question expecting yes/no answer." },
          { original: "I am ready to deploy. (Falling tone)", explanation: "Conveys a confident, completed statement." }
        ]
      }
    ]
  },
  {
    id: "professional_vocab",
    title: "Daily & Professional Vocabulary",
    category: "Vocabulary Expansion",
    summary: "Become an English expert in professional domains. Learn power verbs and daily idioms for work environments.",
    introduction: "To stand out as an expert communicator, you must move beyond generic words like 'do', 'make', or 'help'. Learn to use high-impact action verbs and business idioms to present your ideas with authority and clarity.",
    sections: [
      {
        heading: "1. High-Impact Professional Action Verbs",
        body: "Use these verbs on your resume, in interviews, and during status updates to describe your achievements with impact.",
        examples: [
          { original: "I spearheaded the database migration project.", explanation: "'Spearhead' means to lead an initiative or project." },
          { original: "We streamlined our compilation workflow.", explanation: "'Streamline' means to simplify or improve a system by removing unnecessary steps." },
          { original: "We should leverage this open-source library.", explanation: "'Leverage' means to use something to its maximum advantage." }
        ]
      },
      {
        heading: "2. Essential Daily Expressions for Collaboration",
        body: "Daily expressions used by English experts to coordinate tasks, handle timelines, and align team expectations.",
        examples: [
          { original: "Please keep me in the loop regarding the release.", explanation: "'In the loop' means kept informed or updated." },
          { original: "Let's think outside the box to solve this bug.", explanation: "'Think outside the box' means to think creatively from a new perspective." },
          { original: "I will iron out the details by tomorrow morning.", explanation: "'Iron out' means to resolve small problems or finalize plans." }
        ]
      }
    ]
  }
]

export const ENGLISH_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "Select the correct sentence for a habit or routine:",
    options: [
      "I am debugging my program every morning.",
      "I debugs my program every morning.",
      "I debug my program every morning.",
      "I have debugged my program every morning."
    ],
    answerIndex: 2,
    explanation: "Habits and routines use the simple present tense. With the subject 'I', the verb remains base form ('debug')."
  },
  {
    id: "q2",
    question: "What is the meaning of the phrasal verb 'break down' in: 'Our database decided to break down.'?",
    options: [
      "To inspect closely",
      "To stop working or crash",
      "To split into parts",
      "To improve performance"
    ],
    answerIndex: 1,
    explanation: "In tech contexts, 'break down' means to crash, fail, or stop functioning."
  },
  {
    id: "q3",
    question: "Which sentence correctly expresses an intention or plan made before speaking?",
    options: [
      "I will build the API tonight.",
      "I am building the API tonight.",
      "I am going to build the API tonight.",
      "I builded the API tonight."
    ],
    answerIndex: 2,
    explanation: "'Going to' is used to express prior intentions or plans. 'Will' is typically for decisions made at the moment of speaking."
  },
  {
    id: "q4",
    question: "Choose the correct preposition: 'We need to comply ______ the safety standards.'",
    options: [
      "with",
      "to",
      "on",
      "by"
    ],
    answerIndex: 0,
    explanation: "The verb 'comply' always pairs with the preposition 'with' (comply with)."
  },
  {
    id: "q5",
    question: "Which verb describes simplifying a workflow to make it more efficient?",
    options: [
      "Spearhead",
      "Leverage",
      "Streamline",
      "Touch base"
    ],
    answerIndex: 2,
    explanation: "'Streamline' means to make a process or system more efficient by removing delays or unnecessary steps."
  },
  {
    id: "q6",
    question: "What does it mean if you 'spearhead' a team initiative?",
    options: [
      "You cancel it because of errors.",
      "You lead the design and implementation of it.",
      "You test it for security compliance.",
      "You delegate it fully to a junior engineer."
    ],
    answerIndex: 1,
    explanation: "'Spearhead' means to take the lead on a project or initiative and guide it to completion."
  }
]

export const ROLEPLAY_SCENARIOS: RoleplayScenario[] = [
  {
    id: "job_interview",
    title: "Software Engineer Job Interview",
    description: "Practice answering behavioral and technical questions in a professional setting.",
    iconName: "briefcase",
    startStepId: "welcome",
    steps: {
      "welcome": {
        id: "welcome",
        botUtterance: "Hello! Welcome to our team interview. Let's start. Could you briefly introduce yourself and describe your technical background?",
        feedback: "Tip: Start with a brief summary of your years of experience, primary stack, and a notable project you worked on.",
        userChoices: [
          { text: "I have 3 years of software development experience, specializing in React and Node.js. Recently I built a high-performance visualizer.", nextStepId: "experience_good" },
          { text: "Well, I write code in JS and NextJS. I like coding a lot and building websites.", nextStepId: "experience_weak" }
        ]
      },
      "experience_good": {
        id: "experience_good",
        botUtterance: "That sounds impressive! Speaking of projects, how do you handle technical disagreements or conflicts within your team?",
        feedback: "Tip: Use the STAR method (Situation, Task, Action, Result) and focus on constructive communication and data-driven choices.",
        userChoices: [
          { text: "I listen to their perspective, explain my logic using benchmarking data, and search for a compromise that aligns with project goals.", nextStepId: "conflict_good" },
          { text: "I usually tell them why my solution is better and prove it by building a demo first.", nextStepId: "conflict_weak" }
        ]
      },
      "experience_weak": {
        id: "experience_weak",
        botUtterance: "I see. We look for developers who can articulate their design choices. What is the most challenging bug you solved?",
        feedback: "Tip: Focus on how you systematically diagnosed the problem (e.g. logging, devtools) rather than just saying it resolved itself.",
        userChoices: [
          { text: "I debugged a race condition in state management by tracing event callbacks and replacing it with a queue structure.", nextStepId: "conflict_good" },
          { text: "Our server kept crashing when opening the URL. I restarted the server and eventually it started working.", nextStepId: "conflict_weak" }
        ]
      },
      "conflict_good": {
        id: "conflict_good",
        botUtterance: "Excellent! You communicated that clearly. Do you have any questions for us about the role or the team?",
        feedback: "Tip: Always ask questions at the end of an interview to show interest. Ask about team dynamics, stack growth, or engineering culture.",
        userChoices: [
          { text: "What does the typical day look like, and how does the team handle code reviews?", nextStepId: "end_success" },
          { text: "No, everything is clear. I don't have any questions.", nextStepId: "end_success" }
        ]
      },
      "conflict_weak": {
        id: "conflict_weak",
        botUtterance: "Alright. It's important to demonstrate collaboration skills. Do you have any final questions for us?",
        feedback: "Tip: Declining to ask questions can signal a lack of interest. Try asking about their roadmap or tooling.",
        userChoices: [
          { text: "Yes, what stack is the team planning to migrate to in the future?", nextStepId: "end_success" },
          { text: "No, I'm good. Thank you.", nextStepId: "end_success" }
        ]
      },
      "end_success": {
        id: "end_success",
        botUtterance: "Thank you for your time today! We will review your interview responses and get back to you shortly. Keep practicing!",
        feedback: "Congratulations! You finished the job interview roleplay. Try the other scenarios to practice more spoken English formats.",
        userChoices: [
          { text: "Restart Interview", nextStepId: "welcome" }
        ]
      }
    }
  },
  {
    id: "restaurant",
    title: "Ordering Food at a Bistro",
    description: "Practice polite requests, clarifying orders, and asking for check in a restaurant setting.",
    iconName: "utensils",
    startStepId: "welcome",
    steps: {
      "welcome": {
        id: "welcome",
        botUtterance: "Hi, welcome to Bistro Cafe! Table for one? Are you ready to order, or do you need a couple of minutes?",
        feedback: "Tip: Use polite greetings like 'I would like to have...' or request clarification on the menu.",
        userChoices: [
          { text: "Hello! I am ready. I'd like to order the grilled salmon, please.", nextStepId: "order_salmon" },
          { text: "I need a minute. What are today's specials?", nextStepId: "specials" }
        ]
      },
      "specials": {
        id: "specials",
        botUtterance: "Today's special is roasted garlic chicken served with asparagus and mashed potatoes. It is delicious!",
        feedback: "Tip: Say 'I will go with that' or request changes if you have food preferences.",
        userChoices: [
          { text: "That sounds delicious. I will go with the garlic chicken.", nextStepId: "order_chicken" },
          { text: "Hmm, I think I will stick to the grilled salmon.", nextStepId: "order_salmon" }
        ]
      },
      "order_salmon": {
        id: "order_salmon",
        botUtterance: "Great choice! The salmon comes with roasted vegetables. Would you like any drinks or sides with that?",
        feedback: "Tip: If ordering drinks, use 'Can I get...' or 'I'll have a...'.",
        userChoices: [
          { text: "Yes, I will have a glass of iced lemon tea, please.", nextStepId: "drink_yes" },
          { text: "No, just tap water is fine. Thank you.", nextStepId: "drink_no" }
        ]
      },
      "order_chicken": {
        id: "order_chicken",
        botUtterance: "Excellent choice! Garlic chicken is our bestseller. Would you like any drinks or sides with that?",
        feedback: "Tip: You can say 'No, thank you' politely if you do not want anything else.",
        userChoices: [
          { text: "Can I get a bottle of sparkling water with lime?", nextStepId: "drink_yes" },
          { text: "No, that will be all for now.", nextStepId: "drink_no" }
        ]
      },
      "drink_yes": {
        id: "drink_yes",
        botUtterance: "Perfect. I'll get that started for you right away. [A few moments later] Here is your meal! How is everything tasting?",
        feedback: "Tip: Express satisfaction ('Everything is delicious!') or make requests politely.",
        userChoices: [
          { text: "It is delicious! Everything tastes wonderful.", nextStepId: "ask_bill" },
          { text: "Could I get some extra napkins, please?", nextStepId: "ask_bill" }
        ]
      },
      "drink_no": {
        id: "drink_no",
        botUtterance: "Certainly. I'll get that started. [A few moments later] Here is your meal. Can I get you anything else?",
        feedback: "Tip: Ask for the bill politely when you are ready to pay.",
        userChoices: [
          { text: "No, I'm good. Could I have the bill when you have a moment?", nextStepId: "pay_bill" },
          { text: "Everything is fine, thank you.", nextStepId: "ask_bill" }
        ]
      },
      "ask_bill": {
        id: "ask_bill",
        botUtterance: "I'm glad you're enjoying it! Let me know if you need anything else. [Later] Ready for the check?",
        feedback: "Tip: Say 'Yes, please' and specify if you want to pay by card or cash.",
        userChoices: [
          { text: "Yes, please. Can I pay by credit card?", nextStepId: "pay_bill" },
          { text: "Yes, please. I will pay in cash.", nextStepId: "pay_bill" }
        ]
      },
      "pay_bill": {
        id: "pay_bill",
        botUtterance: "Of course! Card or cash is fine. Here is the bill. Thank you for dining with us! Have a wonderful day.",
        feedback: "Congratulations! You completed the restaurant ordering dialogue. Notice how polite expressions ('please', 'could I get') create better conversations.",
        userChoices: [
          { text: "Restart Restaurant Roleplay", nextStepId: "welcome" }
        ]
      }
    }
  },
  {
    id: "networking",
    title: "Tech Conference Networking",
    description: "Practice introducing yourself, explaining your tech stack, and swapping info with a Senior Developer.",
    iconName: "users",
    startStepId: "welcome",
    steps: {
      "welcome": {
        id: "welcome",
        botUtterance: "Hi there! I noticed you were listening to the panel discussion on microservices. Are you currently building distributed systems at your work?",
        feedback: "Tip: Introduce yourself as an expert. Use strong verbs like 'spearhead' or 'streamline' and name your stack confidently.",
        userChoices: [
          { text: "Hi! Yes, I spearhead our backend team's migration from monolithic systems to microservices using Node and Docker.", nextStepId: "tech_strong" },
          { text: "Hello! Yes, I write backend API code for some microservices in our company. It works okay.", nextStepId: "tech_weak" }
        ]
      },
      "tech_strong": {
        id: "tech_strong",
        botUtterance: "That is fantastic! Spearheading a migration takes clear design practices. How do you handle cache synchronization across services?",
        feedback: "Tip: Present options clearly. Mention techniques like 'event-driven updates' or 'cache-aside patterns' to show domain expertise.",
        userChoices: [
          { text: "We leverage Redis with an event-driven model, subscribing to Kafka topics to invalidate stale cache data in real-time.", nextStepId: "design_strong" },
          { text: "We set a low TTL on our cache so it updates automatically every few minutes.", nextStepId: "design_weak" }
        ]
      },
      "tech_weak": {
        id: "tech_weak",
        botUtterance: "I see. It can be challenging to coordinate separate APIs. How do you optimize latency and prevent server crashes?",
        feedback: "Tip: Explain how you diagnose and streamline processes rather than just hoping they do not crash.",
        userChoices: [
          { text: "We benchmark our query latency and streamline bottleneck operations by using indexing and asynchronous task workers.", nextStepId: "design_strong" },
          { text: "If it crashes, we restart the services. We also try not to write complex queries.", nextStepId: "design_weak" }
        ]
      },
      "design_strong": {
        id: "design_strong",
        botUtterance: "Excellent strategy! It's clear you've ironed out the latency hurdles. I'd love to connect on LinkedIn to keep in the loop. Do you have a card?",
        feedback: "Tip: Say 'I would be delighted to connect' and swap contact info politely. This demonstrates top-tier networking confidence.",
        userChoices: [
          { text: "I would be delighted! Let's swap details. You can scan my LinkedIn QR code right here.", nextStepId: "end_success" },
          { text: "Sure, let me find my contact card for you.", nextStepId: "end_success" }
        ]
      },
      "design_weak": {
        id: "design_weak",
        botUtterance: "Right, restarting is a quick fix, but structural analysis keeps it stable. I'm heading to the next session, but let's connect on LinkedIn to share ideas.",
        feedback: "Tip: Always accept networking opportunities enthusiastically. It shows you value professional growth.",
        userChoices: [
          { text: "Absolutely, let's connect! Here is my LinkedIn profile name.", nextStepId: "end_success" },
          { text: "Okay, thank you. Goodbye.", nextStepId: "end_success" }
        ]
      },
      "end_success": {
        id: "end_success",
        botUtterance: "It was great talking to you. Good luck with your backend engineering roadmap, and let's touch base soon!",
        feedback: "Congratulations! You finished the professional tech networking dialogue. By using professional verbs ('spearhead', 'leverage', 'streamline', 'touch base'), you sounded like an English expert!",
        userChoices: [
          { text: "Restart Networking Scenario", nextStepId: "welcome" }
        ]
      }
    }
  }
]
