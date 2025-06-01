class CharacterFactory {
    constructor(scene) {
        this.scene = scene;
        this.characters = {};
        this.initializeCharacters();
    }

    initializeCharacters() {
        // Define all programming language characters here
        this.createJavaScriptCharacter();
        this.createPythonCharacter();
        this.createJavaCharacter();
        this.createRubyCharacter();
        this.createGoCharacter();
        this.createRustCharacter();
        this.createCppCharacter();
        this.createSwiftCharacter();
        this.createKotlinCharacter();
        this.createTypeScriptCharacter();
    }

    createJavaScriptCharacter() {
        const jsChar = new Character({
            name: 'JavaScript',
            sprite: 'js_char',
            rarity: 'common',
            attributes: {
                speed: 7,
                flexibility: 9,
                power: 6
            },
            description: 'The versatile web language that powers the internet.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '01666666666610',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['javascript'] = jsChar;
    }

    createPythonCharacter() {
        const pythonChar = new Character({
            name: 'Python',
            sprite: 'python_char',
            rarity: 'common',
            attributes: {
                readability: 9,
                versatility: 8,
                power: 7
            },
            description: 'The friendly language loved by beginners and experts alike.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01444444444410',
                '01444444444410',
                '01444444555510',
                '01444455555510',
                '01444555555510',
                '01444555555510',
                '01444455555510',
                '01444444555510',
                '01444444444410',
                '01444444444410',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['python'] = pythonChar;
    }

    createJavaCharacter() {
        const javaChar = new Character({
            name: 'Java',
            sprite: 'java_char',
            rarity: 'uncommon',
            attributes: {
                stability: 8,
                portability: 9,
                verbosity: 7
            },
            description: 'Write once, run anywhere. The enterprise favorite.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333999933310',
                '01339999993310',
                '01339999993310',
                '01333999933310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['java'] = javaChar;
    }

    createRubyCharacter() {
        const rubyChar = new Character({
            name: 'Ruby',
            sprite: 'ruby_char',
            rarity: 'uncommon',
            attributes: {
                elegance: 9,
                readability: 8,
                productivity: 8
            },
            description: 'Elegant syntax focused on programmer happiness.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '01333333333310',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['ruby'] = rubyChar;
    }

    createGoCharacter() {
        const goChar = new Character({
            name: 'Go',
            sprite: 'go_char',
            rarity: 'rare',
            attributes: {
                simplicity: 8,
                performance: 9,
                concurrency: 9
            },
            description: 'Fast, statically typed, and built for modern hardware.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['go'] = goChar;
    }

    createRustCharacter() {
        const rustChar = new Character({
            name: 'Rust',
            sprite: 'rust_char',
            rarity: 'epic',
            attributes: {
                safety: 10,
                performance: 9,
                concurrency: 8
            },
            description: 'Memory safety without garbage collection.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01CCC111CCC110',
                '01CCCC1CCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '01CCCCCCCCC110',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['rust'] = rustChar;
    }

    createCppCharacter() {
        const cppChar = new Character({
            name: 'C++',
            sprite: 'cpp_char',
            rarity: 'rare',
            attributes: {
                performance: 10,
                complexity: 8,
                power: 9
            },
            description: 'High performance with object-oriented programming.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '01555555555510',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['cpp'] = cppChar;
    }

    createSwiftCharacter() {
        const swiftChar = new Character({
            name: 'Swift',
            sprite: 'swift_char',
            rarity: 'rare',
            attributes: {
                safety: 8,
                speed: 8,
                readability: 7
            },
            description: 'Fast and powerful language for iOS and macOS development.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '01999999999910',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['swift'] = swiftChar;
    }

    createKotlinCharacter() {
        const kotlinChar = new Character({
            name: 'Kotlin',
            sprite: 'kotlin_char',
            rarity: 'uncommon',
            attributes: {
                conciseness: 9,
                safety: 8,
                interoperability: 9
            },
            description: 'Modern language fully interoperable with Java.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01AAA111AAA110',
                '01AAAA1AAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '01AAAAAAAAA110',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['kotlin'] = kotlinChar;
    }

    createTypeScriptCharacter() {
        const tsChar = new Character({
            name: 'TypeScript',
            sprite: 'ts_char',
            rarity: 'uncommon',
            attributes: {
                typeSafety: 9,
                tooling: 8,
                scalability: 8
            },
            description: 'JavaScript with static types.',
            pixelArt: [
                '00000000000000',
                '00111111111100',
                '01555555555510',
                '01555111555510',
                '01551111155510',
                '01511111115510',
                '01555111555510',
                '01555111555510',
                '01555111555510',
                '01555111555510',
                '01555111555510',
                '01555555555510',
                '00111111111100',
                '00000000000000'
            ]
        });
        this.characters['typescript'] = tsChar;
    }

    getCharacter(name) {
        return this.characters[name.toLowerCase()];
    }

    getAllCharacters() {
        return Object.values(this.characters);
    }

    getRandomCharacter() {
        const characters = this.getAllCharacters();
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    }

    // Get a character based on contribution type
    getCharacterByContribution(contributionType) {
        // Map contribution types to characters
        const contributionMap = {
            'commit': ['javascript', 'python', 'java'],
            'pull_request': ['typescript', 'rust', 'go'],
            'issue': ['ruby', 'swift'],
            'code_review': ['cpp', 'kotlin']
        };
        
        const possibleCharacters = contributionMap[contributionType] || 
            Object.keys(this.characters);
        
        const randomIndex = Math.floor(Math.random() * possibleCharacters.length);
        return this.getCharacter(possibleCharacters[randomIndex]);
    }
}
