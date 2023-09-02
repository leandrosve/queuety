interface Props extends React.SVGProps<SVGSVGElement> {
  background?: string;
  color?: string;
}

const BrandIcon = ({ background = 'transparent', color = 'var(--text-500)', ...props }: Props) => {
  return (
    <svg xmlns='http://www.w3.org/2000/svg' width='700' height='700' viewBox='0 0 700 700' {...props}>
      <rect x='33' y='12' width='635' height='677' fill={background} />
      <path
        fill={color}
        d='M72,37H284.643v64.756H139.8V599.244c3.707,1.352,10.155,1.028,15.409,1.028H284.643V664H72V37Zm252.706,0H536.322V301.162h91.426c2,5.474,1.027,15.427,1.027,22.613V369H537.349c-2.9,7.959-1.027,25.783-1.027,35.975v79.146h92.453v67.839H536.322V664H324.706V599.244H468.523V551.962H283.616V485.151c4.458-1.625,12.412-1.028,18.49-1.028H468.523V369H283.616V302.19c4.458-1.625,12.412-1.028,18.49-1.028H468.523V100.728H324.706V37Z'
      />
    </svg>
  );
};

export default BrandIcon;
