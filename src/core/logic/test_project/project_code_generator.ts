export class ProjectCodeGenerator {
  static generate(projectName: string): string {
    //remove extra spaces and symbols, then split the name into words
    const words = projectName.trim().replace(/[^a-zA-Z\s]/g, '')
      .split(/\s+/).filter((word) => word.length > 0);

    if (words.length === 0) {
      throw new Error('Project name cannot be empty');
    }

    if (words.length >= 2) {
      const firstPart = words[0].substring(0, 3);
      const secondPart = words[1].substring(0, 4);
      return this.getConsonants(firstPart + secondPart).toUpperCase();
    }

    return this.getConsonants(words[0]).substring(0, 6).toUpperCase();
  }

  static getConsonants(prefix: string): string {
    //remove the last letter with a consonant if the last letter is a vowel
    return prefix.replace(/[aeiou]+$/gi, '');
  }
}
