## Manual Checks

checked until 2/230

### Verb markers in middle of line

(?<!(^  ((\d\. )?Inf\. des )?)|(\Ws\. )|[A-Z])(IV|ZP|RP|RM|MV|KT|T|P)(?![A-Za-zöäü.])

### fut etc. in middle of line

(?<!(^  ([a-z]\) )?)|(\Ws\. )|([აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ]([)~\]])? )|(\W(IV|ZP|RP|RM|MV|KT|T|P)[¹²³⁴⁵⁶⁷⁸⁹]? )|[A-Za-z])(fut|aor|pr|imp|impf|opt)(?![a-zäöü.])

### fut etc. not followed by Georgian

(?<![a-zA-Z]|(\Ws\. )|([a-z] ))(fut|aor|pr|imp|impf|opt)(?![a-zäüö.]|$|( [~-][ ,])|( ((\d\. )|(\d\.sg ))?([\[(])?(-)?[(აბგდევზთიკლმნოპჟრსტუფქღყშჩცძწჭხჯჰ])|( fehlt))