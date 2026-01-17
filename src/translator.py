class Translator:
    def __init__(self):
        # Dictionary mapping Semantic Tokens -> Language Translations
        self.dictionary = {
            'HELLO': {
                'English': 'Hello',
                'Hindi': 'नमस्ते (Namaste)',
                'Malayalam': 'നമസ്കാരം (Namaskaram)',
                'Japanese': 'こんにちは (Konnichiwa)'
            },
            'THANK_YOU': {
                'English': 'Thank You',
                'Hindi': 'धन्यवाद (Dhanyavaad)',
                'Malayalam': 'നന്ദി (Nandi)',
                'Japanese': 'ありがとう (Arigatou)'
            },
            'YES': {
                'English': 'Yes',
                'Hindi': 'हाँ (Haan)',
                'Malayalam': 'അതെ (Athe)',
                'Japanese': 'はい (Hai)'
            },
            'NO': {
                'English': 'No',
                'Hindi': 'नहीं (Nahi)',
                'Malayalam': 'അല്ല (Alla)',
                'Japanese': 'いいえ (Iie)'
            },
            'HELP': {
                'English': 'Help',
                'Hindi': 'मदद (Madad)',
                'Malayalam': 'സഹായം (Sahayam)',
                'Japanese': '助けて (Tasukete)'
            },
            'PLEASE': {
                'English': 'Please',
                'Hindi': 'कृपया (Krupaya)',
                'Malayalam': 'ദയവായി (Dayavayi)',
                'Japanese': 'お願いします (Onegaishimasu)'
            },
            'GOODBYE': {
                'English': 'Goodbye',
                'Hindi': 'अलविदा (Alvida)',
                'Malayalam': 'വിട (Vida)',
                'Japanese': 'さようなら (Sayonara)'
            },
            'SORRY': {
                'English': 'Sorry',
                'Hindi': 'क्षमा करें (Kshama Karen)',
                'Malayalam': 'ക്ഷമിക്കണം (Kshamikkanam)',
                'Japanese': 'ごめんなさい (Gomennasai)'
            },
            'EAT': {
                'English': 'Eat',
                'Hindi': 'खाना (Khana)',
                'Malayalam': 'കഴിക്കുക (Kazhikkuka)',
                'Japanese': '食べる (Taberu)'
            },
            'DRINK': {
                'English': 'Drink',
                'Hindi': 'पीना (Peena)',
                'Malayalam': 'കുടിക്കുക (Kudikkuka)',
                'Japanese': '飲む (Nomu)'
            }
        }

    def translate(self, token):
        """
        Returns a dictionary of translations for the given token.
        """
        return self.dictionary.get(token, {
            'English': token,
            'Hindi': 'Unknown',
            'Malayalam': 'Unknown',
            'Japanese': 'Unknown'
        })
