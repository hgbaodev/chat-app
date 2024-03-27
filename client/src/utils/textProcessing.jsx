export function extractFirstHttpLink(text) {
  var regex = /(https?)[^\s/$.?#].[^\s]*/i;
  var match = text.match(regex);
  if (match) {
    return match[0];
  } else {
    return null;
  }
}

export function convertLinksToAnchorTags(text) {
  var regex = /(https?)[^\s/$.?#].[^\s]*/gi;
  return text.replace(
    regex,
    '<a className="underline" target="_blank" href="$&">$&</a>'
  );
}
