export function courseMap(courseAbbreviation: string) {
  switch (courseAbbreviation) {
    case "BSBA":
      return "Bachelor of Science in Business Administration";
      break;
    case "BSCS":
      return "Bachelor of Science in Computer Science";
      break;
    case "BSHM":
      return "Bachelor of Science in Hospitality Management";
      break;
    case "BSIT":
      return "Bachelor of Science in Information Technology";
      break;
    case "BSP":
      return "Bachelor of Science in Psychology";
      break;
    case "BSCRIM":
      return "Bachelor of Science in Criminology";
      break;
    case "BSED":
      return "Bachelor of Secondary Education";
      break;
    default:
      return "";
      break;
  }
}

export function formatMajor(major: string) {
  //HUMAN_RESOURCE_MANAGEMENT
  return major
    .replace(/_/g, " ")
    .replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
}
