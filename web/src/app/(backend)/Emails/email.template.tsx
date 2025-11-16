import * as React from 'react';

interface EmailTemplateProps {
  texto: string,

}

export function EmailTemplate({ texto }: EmailTemplateProps) {
  return (
    <div>
      <p>{texto}</p>
    </div>
  );
}