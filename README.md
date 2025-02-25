# cheatdle

Patrick Wagstrom

February 2025

## Overview

Do you suck at [that five letter word guessing game](https://www.nytimes.com/games/wordle/index.html) from the Grey Lady? Do you want a little help, but not to go so far as just searching for today's answer. You're in luck, that's why I created Cheatdle.

Okay, I didn't create it for you. I created it for some elementary school kids who were starting to play Wordle. So, if you need this, your wordle skill is on par with an above average 2nd grader. Congrats!

It's pretty straight forward - just enter the letters of each of your guesses and then click on the letters to change their colors. Cheatdle then searches through a list of five letter words to find the ones that fit the constraints. But, rather than just giving you a random list of words, it attempts to prioritize the words by their frequency in the English language. Almost. There were a bunch of rare words that probably aren't actually going to be answers that I weren't in [Peter Norvig's word count of the 100k most popular words](http://norvig.com/ngrams/) in the English language. Those will always appear at the end.

## Features

- Helps you seem way smarter than you
- Removes the sense of satisfaction you get from solving a puzzle on your own
- A couple of fancy animations thrown here and there
- I think it's even mobile friendly

## Why Did I Do This?

Well, I had been asked about an easy way to do this, and I wasn't going to explain to a bunch of elementary school kids how to drop into the terminal on their Chromebooks and type `cat /usr/share/dict/words | grep -i "^[^tac]o[^tac][^tac][^tacs]$" | grep -i s`. Okay, maybe I did, but that's besides the point. I've met "principal" engineers and architects who can't write a regex even if ChatGPT was writing it for them, so asking kids to do grep, was probably too much right now.

I also wanted an excuse to try out a small project using nearly entirely LLM based programming. I've used co-pilot enough in the past, but this was the first time that I used [aider](https://aider.chat) in conjunction with claude-sonnet-3.5 to write the code. I also used OpenAI o1 in order to help me refine the spec of the program and generate the prompts that I later fed to Aider.

So yeah, the code is probably messy, but that's because I don't do frontend development. It's been almost 10 years since I did any sort of frontend work and it seems like it's only gotten more confusing. Give me my world of jQuery and get off my lawn or something.

## Usage

```bash
npm install
npm run generate-wordlist
npm run dev
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

I feel confident that despite using Aider for a lot of this project, I did enough creative work to fix silly things and craft prompts that it still qualifies as a creative work. But, not so much that I think it's worth anything, so you get it for free.