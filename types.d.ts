declare module 'react-simple-snackbar' {

  export type SnackbarProviderProps = {
    children?: React.ReactNode;
  };

  export const SnackbarProvider: React.FC<SnackbarProviderProps>;

  /**
   * @argument node The node you want to show into the Snackbar.
   * @argument duration A number in milliseconds to set the duration of the Snackbar. The default value is 6000.
   * @argument backgroundColor An optional CSS color string to override the Snackbar's background color for this call.
   */
  type OpenSnackbar = (node: string | JSX.Element, duration?: number, backgroundColor?: string) => void;

  /**
   * This method is used if you want to close the Snackbar programmatically. It doesn't receive any params.
   */
  type CloseSnackbar = () => void;

  export type SnackbarPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

  export interface SnackbarOptions {

    /**
     * A custom position for your Snackbar. The default value is center (true viewport center).
     */
    position?: SnackbarPosition;

    /**
     * A style object with camelCased properties and string values. These styles are applied to the Snackbar itself.
     */
    style?: { [key: string]: string };

    /**
     * Same as style, but the styles are applied to the close button. You can use font properties to style the X icon.
     */
    closeStyle?: { [key: string]: string };
  }

  export const useSnackbar: (options?: SnackbarOptions) => [OpenSnackbar, CloseSnackbar];

  export interface WithSnackbar {
    openSnackbar: OpenSnackbar;
    closeSnackbar: CloseSnackbar;
  }

  export const withSnackbar: <P extends object>(Component: React.ComponentType<P>, options?: SnackbarOptions) => React.ComponentType<P & WithSnackbar>;

  export default SnackbarProvider;
}
