interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  fullWidth?: boolean
}

export default function Button({ fullWidth, ...props }: ButtonProps) {
  return (
    <button
      className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 ${
        fullWidth ? 'w-full' : ''
      }`}
      {...props}
    />
  )
}
