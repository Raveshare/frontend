export const EditorIconPointer = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M15.546 4.26c-2.03-.507-3.656-.914-4.953-1.115-1.31-.202-2.52-.24-3.624.193a6.408 6.408 0 0 0-3.63 3.63c-.433 1.105-.396 2.316-.194 3.625.201 1.297.608 2.923 1.115 4.953l2.032 8.126c.44 1.758.78 3.119 1.072 4.13.28.963.569 1.814.97 2.401 2.43 3.563 7.615 3.756 10.303.384.444-.556.796-1.383 1.145-2.323.368-.986.808-2.319 1.377-4.039l.011-.033c.22-.665.291-.871.376-1.047.335-.7.9-1.264 1.599-1.6.176-.084.382-.155 1.047-.375l.033-.01c1.72-.57 3.053-1.01 4.039-1.378.94-.35 1.767-.701 2.323-1.145 3.372-2.688 3.179-7.873-.384-10.304-.587-.4-1.438-.69-2.401-.969-1.011-.293-2.372-.633-4.13-1.072L15.546 4.26Z"
          />
        </svg>
      </>
    )
  }
  
  export const EditorIconUpload = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M21 3.086V4.8c0 2.52 0 3.78.49 4.743a4.499 4.499 0 0 0 1.967 1.966C24.42 12 25.68 12 28.2 12h1.714M21 3.086C20.41 3 19.704 3 18.523 3H15.6c-3.36 0-5.04 0-6.324.654a6 6 0 0 0-2.622 2.622C6 7.56 6 9.24 6 12.6v10.8c0 3.36 0 5.04.654 6.324a6 6 0 0 0 2.622 2.622C10.56 33 12.24 33 15.6 33h4.8c3.36 0 5.04 0 6.324-.654a6 6 0 0 0 2.622-2.622C30 28.44 30 26.76 30 23.4v-8.923c0-1.181 0-1.887-.086-2.477M21 3.086c.144.021.28.047.415.08.613.147 1.198.39 1.735.718.605.371 1.124.89 2.162 1.928l1.876 1.876c1.038 1.038 1.557 1.557 1.928 2.162a6 6 0 0 1 .718 1.735c.033.135.059.271.08.415M18 25.5v-9m0 0a.704.704 0 0 0-.444.157A14.999 14.999 0 0 0 15 19.312m3-2.812c.157 0 .314.052.444.157A14.999 14.999 0 0 1 21 19.312"
          />
        </svg>
      </>
    )
  }
  
  export const EditorIconNFTS = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="m25.5 23.623-3 4.875h6l-3 4.875M17.297 31.5h-1.178c-1.16 0-1.994 0-2.666-.053M32.039 16.5h-3.483c-1.403 0-2.104 0-2.695.051-6.572.571-11.782 5.746-12.357 12.272-.05.58-.051 1.266-.051 2.624M32.039 16.5c-.227-.778-.687-1.6-1.508-3.068l-2.234-3.994c-1.005-1.797-1.508-2.696-2.223-3.35a6.05 6.05 0 0 0-2.198-1.285c-.923-.303-1.958-.303-4.028-.303h-3.729c-2.07 0-3.105 0-4.028.303a6.05 6.05 0 0 0-2.198 1.285c-.715.654-1.218 1.553-2.223 3.35l-2.182 3.9C4.536 15.04 4.06 15.89 3.874 16.79a5.96 5.96 0 0 0 0 2.418c.186.9.662 1.752 1.614 3.453l2.182 3.9c1.005 1.797 1.508 2.696 2.223 3.35a6.05 6.05 0 0 0 2.198 1.285c.406.133.834.208 1.362.25M32.039 16.5c.031.107.058.213.08.32a5.96 5.96 0 0 1 .021 2.377c-.133.688-.435 1.348-.985 2.395M13.453 15c-.835 0-1.51-.672-1.51-1.5s.675-1.5 1.51-1.5c.834 0 1.51.672 1.51 1.5s-.676 1.5-1.51 1.5Z"
          />
        </svg>
      </>
    )
  }
  
  export const EditorIconTextCursor = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M18 9c0-1.395 0-2.092-.153-2.665a4.5 4.5 0 0 0-3.182-3.182C14.092 3 13.395 3 12 3m6 6c0-1.395 0-2.092.153-2.665a4.5 4.5 0 0 1 3.182-3.182C21.908 3 22.605 3 24 3m-6 6v9m0 9c0 1.395 0 2.092-.153 2.665a4.5 4.5 0 0 1-3.182 3.182C14.092 33 13.395 33 12 33m6-6c0 1.395 0 2.092.153 2.665a4.5 4.5 0 0 0 3.182 3.182C21.908 33 22.605 33 24 33m-6-6v-9m0 0h3.013M18 18h-3"
          />
        </svg>
      </>
    )
  }
  export const EditorIconTemplates = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M31.5 9.3c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C29.22 4.5 28.38 4.5 26.7 4.5h-.9c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C21 6.78 21 7.62 21 9.3v17.4c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327h.9c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311c.327-.642.327-1.482.327-3.162V9.3ZM15 8.25c0-.697 0-1.045-.058-1.335a3 3 0 0 0-2.357-2.357c-.29-.058-.638-.058-1.335-.058h-3c-.697 0-1.045 0-1.335.058a3 3 0 0 0-2.357 2.357c-.058.29-.058.638-.058 1.335s0 1.045.058 1.335a3 3 0 0 0 2.357 2.357c.29.058.638.058 1.335.058h3c.697 0 1.046 0 1.335-.058a3 3 0 0 0 2.357-2.357C15 9.295 15 8.947 15 8.25Zm0 14.55c0-1.68 0-2.52-.327-3.162a3 3 0 0 0-1.311-1.311C12.72 18 11.88 18 10.2 18h-.9c-1.68 0-2.52 0-3.162.327a3 3 0 0 0-1.311 1.311C4.5 20.28 4.5 21.12 4.5 22.8v3.9c0 1.68 0 2.52.327 3.162a3 3 0 0 0 1.311 1.311c.642.327 1.482.327 3.162.327h.9c1.68 0 2.52 0 3.162-.327a3 3 0 0 0 1.311-1.311C15 29.22 15 28.38 15 26.7v-3.9Z"
          />
        </svg>
      </>
    )
  }
  export const EditorIconAIPanel = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M19.35 4.5c.96 7.555 3.946 12.213 12.15 13.5-7.785 1.221-11.145 5.592-12.15 13.5C18.345 23.592 14.985 19.221 7.2 18c7.785-1.221 11.145-5.592 12.15-13.5Zm-10.8 0c.372 2.26 1.727 3.667 4.05 4.05-2.323.383-3.678 1.79-4.05 4.05-.372-2.26-1.727-3.667-4.05-4.05 2.26-.372 3.667-1.727 4.05-4.05Z"
          />
        </svg>
      </>
    )
  }
  export const EditorIconDraw = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M4.6 27.473c.013-.566.02-.848.089-1.114a2.4 2.4 0 0 1 .284-.667c.145-.233.344-.433.742-.832L25.294 5.194a2.353 2.353 0 0 1 2.946-.317 9.483 9.483 0 0 1 2.9 2.947c.605.975.407 2.21-.388 3.009l-19.46 19.545c-.413.415-.62.622-.86.77a2.375 2.375 0 0 1-.69.287c-.276.066-.568.066-1.152.065l-4.09-.007.1-4.02Z"
          />
        </svg>
      </>
    )
  }
  export const EditorIconShape = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M18 18v14.25M18 18 5.01 11.082M18 18l12.99-6.918M18 32.25c.326 0 .652-.033.972-.098.725-.148 1.406-.525 2.77-1.28l6.017-3.33c1.363-.754 2.044-1.131 2.54-1.659.438-.467.77-1.017.972-1.614.229-.675.229-1.43.229-2.938v-6.662c0-1.508 0-2.263-.229-2.938a4.381 4.381 0 0 0-.28-.65M18 32.25c-.326 0-.652-.033-.972-.098-.725-.148-1.406-.525-2.77-1.28l-6.017-3.33c-1.363-.754-2.044-1.131-2.54-1.659a4.442 4.442 0 0 1-.972-1.614c-.229-.675-.229-1.43-.229-2.938v-6.662c0-1.508 0-2.263.229-2.938.076-.224.17-.44.28-.65m25.982 0a4.48 4.48 0 0 0-.692-.964c-.496-.528-1.177-.905-2.54-1.66l-6.018-3.33c-1.363-.754-2.044-1.131-2.769-1.279a4.874 4.874 0 0 0-1.944 0c-.725.148-1.406.525-2.77 1.28L11.25 6.791 8.241 8.458c-1.363.754-2.044 1.131-2.54 1.659a4.482 4.482 0 0 0-.691.965"
          />
        </svg>
      </>
    )
  }
  
  export const EditorIconLeftRotate = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M9.322 4.005a22.5 22.5 0 0 0-1.573 5.59c-.073.502.322.726.718.878l.141.053m0 0A11.978 11.978 0 0 1 17.997 6c6.627 0 12 5.373 12 12s-5.373 12-12 12c-5.592 0-10.29-3.824-11.622-9m2.233-10.474c1.68.63 3.43 1.058 5.214 1.273"
          />
        </svg>
      </>
    )
  }
  
  export const EditorIconRightRotate = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M26.675 4.005a22.499 22.499 0 0 1 1.573 5.59c.073.502-.323.726-.718.878l-.141.053m0 0A11.978 11.978 0 0 0 18 6C11.373 6 6 11.373 6 18s5.373 12 12 12c5.591 0 10.29-3.824 11.622-9m-2.233-10.474a22.5 22.5 0 0 1-5.214 1.273"
          />
        </svg>
      </>
    )
  }
  
  export const EditorIconHelp = ({
    width,
    height,
    fill,
    strokeColor,
    strokeLinecap,
    strokeLinejoin,
    strokeWidth
  }) => {
    return (
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={width || 30}
          height={height || 30}
          fill={fill || "none"}
          viewBox="0 0 40 40"
        >
          <path
            stroke={strokeColor || "#000"}
            stroke-linecap={strokeLinecap || "round"}
            stroke-linejoin={strokeLinejoin || "round"}
            stroke-width={strokeWidth || 2}
            d="M13.9222 14.5778C13.9222 12.3257 15.7479 10.5 18 10.5C20.2521 10.5 22.0778 12.3257 22.0778 14.5778C22.0778 16.0122 21.3372 17.2736 20.2176 18.0005C19.1316 18.7055 18 19.7052 18 21M18 25.5H18.0015M31.5 18C31.5 25.4558 25.4558 31.5 18 31.5C10.5442 31.5 4.5 25.4558 4.5 18C4.5 10.5442 10.5442 4.5 18 4.5C25.4558 4.5 31.5 10.5442 31.5 18Z"
          />
        </svg>
      </>
    )
  }
  