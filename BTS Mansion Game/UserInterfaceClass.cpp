#include "UserInterfaceClass.h"
#include <iostream>
#include <sstream>
#include <vector>
#include <string>
#include <algorithm>
#include <random>
#include <cctype>

UserInterfaceClass::UserInterfaceClass()
{
    current_input = "";
}

std::string UserInterfaceClass::preventCutoff(const std::string text)const
{
    std::istringstream words(text);
    std::string word;
    std::string wrappedText;
    std::vector<std::string> wordds;

    std::string newLineString = "\n \n";
    std::string indentString = "     ";

    int currentWidth = 0;

    while (words >> word) {
    /*while loop goes through string and prevents text cutoff*/
        if (currentWidth + word.length() > 115) {
            wrappedText += "\n";
            currentWidth = 0;
        }
        if (word == "NEWLINE")
        {
            wrappedText += newLineString;
            currentWidth = 0;
        }
        else if (word == "INDENT")
        {
            //wrappedText += indentString;
        }
        else
        {
            wrappedText += word += " ";
        }

        if(word != "NEWLINE" && word != "INDENT")
            currentWidth += word.length() + 1;
    }

    std::stringstream result;

    return wrappedText;
}

void UserInterfaceClass::displayPrompt(const std::string& prompt) const
{
    std::string dressString = preventCutoff(prompt); // run string through wrapper helper function
	std::cout << dressString << std::endl; //prints strng passed
}



void UserInterfaceClass::displayPrompt(const std::string& prompt, int sanity) const
{
    std::stringstream ss(prompt);
    std::string word;
    std::vector<std::string> words;
    
    if (sanity <= 35){
        std::stringstream ss(preventCutoff(prompt));
    }

    // Split sentence into words
    while (ss >> word) {
        words.push_back(word);
    }

    // Jumble each word in the sentence based on intensity
    for (auto& word : words) {
        word = jumble_word(word, sanity);
    }

    // Rejoin words into the final jumbled sentence
    std::stringstream result;
    for (const auto& word : words) {
        result << word << " ";
    }

    // Remove the trailing space
    std::string result_str = result.str();
    if (!result_str.empty()) {
        result_str.pop_back();
    }

    std::string dressString = preventCutoff(result_str);// run string through wrapper helper function

    std::cout << dressString << std::endl;
}

bool UserInterfaceClass::is_all_uppercase(const std::string& word) const
{
    return std::all_of(word.begin(), word.end(), ::isupper); //returns whether a word is all uppercase
}

std::string UserInterfaceClass::jumble_word(const std::string& word, int intensity) const
{
    if (is_all_uppercase(word)) {
        return word;
    }

    // If the intensity is above 34, no jumbling should occur
    if (intensity >= 35) {
        return word;
    }

    // If the word length is 2 or less, no need to jumble
    if (word.length() <= 2) {
        return word;
    }

    // Reverse intensity to match the desired behavior
    double jumble_factor = 1.0 - (intensity / 100.0); // Higher intensity -> less jumbling

    // If intensity is close to 100, return word as it is or slightly modify
    if (jumble_factor <= 0.1) {
        return word;  // No jumbling at high intensity
    }

    // Copy the word into a mutable format (vector of characters)
    std::string jumbled_word = word;
    std::random_device rd;
    std::mt19937 g(rd());

    // If jumble_factor is higher (i.e., low intensity), scramble more
    if (jumble_factor > 0.5) {
        // Invert jumble_factor to make it stronger for lower intensity
        int num_swaps = static_cast<int>(word.length() * jumble_factor);
        for (int i = 0; i < num_swaps; ++i) {
            // Swap two random characters in the word
            int idx1 = rand() % (word.length() - 1) + 1;  // Skip the first char
            int idx2 = rand() % (word.length() - 1) + 1;  // Skip the last char
            std::swap(jumbled_word[idx1], jumbled_word[idx2]);
        }
    }
    else {
        // At high intensity (jumble_factor is small), only slightly shuffle
        std::shuffle(jumbled_word.begin() + 1, jumbled_word.end() - 1, g); // Skip first and last
    }

    return jumbled_word;
}


void UserInterfaceClass::displayMenu() const
{
	std::cout << "***Welcome to the BTS Mansion Game!***" << std::endl; //No title yet, change in future and adjust for story building etc etc
    std::cout << "===== Main Menu =====" << std::endl;
    std::cout << "START Game" << std::endl;
    std::cout << "QUIT" << std::endl;
    std::cout << "=====================" << std::endl;
    std::cout << "Words in all caps will be input options for this game; please enter an option: ";
}

static inline std::string ltrim(std::string s) {
    s.erase(s.begin(), std::find_if(s.begin(), s.end(), [](unsigned char ch) {
        return !std::isspace(ch);
        }));
    return s;
}

// Function to trim whitespace from the end of a string
static inline std::string rtrim(std::string s) {
    s.erase(std::find_if(s.rbegin(), s.rend(), [](unsigned char ch) {
        return !std::isspace(ch);
        }).base(), s.end());
    return s;
}

// Function to trim whitespace from both ends of a string
static inline std::string trim(std::string s) {
    return ltrim(rtrim(s));
}


void UserInterfaceClass::setCurrentInput(std::string& uInput)
{
    UserInterfaceClass::current_input = uInput; //set passed string to current input private member variable
}

std::string UserInterfaceClass::getCurrentInput() const
{
    return current_input; //returns string of current input private member variable
}

std::string UserInterfaceClass::userInput() 
{
    std::string input;
    std::getline(std::cin, input);
    this->setCurrentInput(input); //sets current input to this
    return trim(input);
}

void UserInterfaceClass::waitForInput() const {
    std::string input;
    while (true) 
    {
        std::getline(std::cin, input);
        if (input.empty())
        {
            break;
        }
        else if (input == "PICKUP")
        {
            break;
        }
        else 
        {
            std::cout << "Invalid input, please press Enter key to continue story\n";
        }
      
       
        
    }
}

bool UserInterfaceClass::isValidInput(const std::string[]) const
{
    //TODO: add logic
    return true;
}

void UserInterfaceClass::displayPentacle(int candleVal)
{
   std::cout << R"(   
       ".d$$$******$$$$c."        
    ".d$P'            '$$c"      
   "$$$$$.           .$$$*$."    
 ".$$ 4$L*$$.     .$$Pd$  '$b"   
 "$F   *$. '$$e.e$$' 4$F   ^$b"  
"d$     $$   z$$$e   $$     '$." 
"$P     `$L$$P` `'$$d$'      $$" 
"$$     e$$F       4$$b.     $$" 
"$b  .$$' $$      .$$ '4$b.  $$" 
"$$e$P    $b     d$`    $$c$F" 
"$P$$$$$$$$$$$$$$$$$$$$$$$$$$"  
 "'$c.      4$.  $$       .$$"   
  "^$$.      $$ d$'      d$P"    
    "'$$c.   `$b$F    .d$P'"     
      "`4$$$c.$$$..e$$P'"        
          "`^^^^^^^`';")" << std::endl;

}
